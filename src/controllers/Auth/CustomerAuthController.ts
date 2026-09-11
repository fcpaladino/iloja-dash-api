import { Request, Response } from "express";
import { Op } from "sequelize";
import { TryCatch } from "../../helpers/TryCatch";
import { gerarCodigoUnico } from "../../utils/helpers";
import SendWhatsapp from "../../helpers/SendWhatsapp";
import Company from "../../models/Company";
import People from "../../models/People";
import PeopleAddress from "../../models/PeopleAddress";
import { createJWT } from "../../utils/jwt";

const localTenants = new Set(["localhost", "127.0.0.1", "::1"]);
const normalizePhone = (value: unknown) => String(value || "").replace(/\D/g, "");
const phoneWhere = (value: unknown) => {
  let digits = normalizePhone(value);
  if (digits.startsWith("55")) digits = digits.slice(2);
  const suffix = digits.slice(-8);
  const normalized = digits.length >= 10 ? `${digits.slice(0, 2)}${suffix}` : digits;
  return { [Op.or]: [{ waId: normalized }, { phoneNumber: { [Op.like]: `%${suffix}` } }] };
};

async function companyFromRequest(req: Request) {
  const tenant = String(req.headers["x-tenant"] || req.headers.host || "").split(":")[0].toLowerCase();
  if (localTenants.has(tenant)) return Company.findByPk(1);
  return Company.findOne({ where: { subdomain: tenant } });
}

class CustomerAuthController {
  private async currentPerson(req: Request) {
    const user = req.user as IReqUser;
    return People.findOne({ where: { id: Number((user as any).peopleId || user.id), companyId: user.companyId, customerPortalAccess: true, active: true } });
  }

  private tokenFor(person: People, company: Company) {
    const name = person.tradeName || person.legalName || "Cliente";
    const token = createJWT({ id: person.id, peopleId: person.id, name: encodeURI(name), email: person.email || "", phone: person.phoneNumber, companyId: person.companyId, companyName: encodeURI(company.name), version: 1 });
    return { data: { access_token: token, user: { id: person.id, peopleId: person.id, name, phone: person.phoneNumber, companyId: person.companyId } } };
  }

  @TryCatch()
  async updateProfile(req: Request, res: Response): Promise<Response> {
    const person = await this.currentPerson(req);
    if (!person) return res.status(403).json({ message: "Acesso ao painel não autorizado." });
    const name = req.body.name !== undefined ? String(req.body.name || "").trim() : null;
    if (name !== null && name.length < 3) return res.status(422).json({ message: "Informe um nome válido." });
    if (name !== null) await person.update({ legalName: name, tradeName: name });

    if (req.body.address !== undefined) {
      const input = req.body.address || {};
      const addressData = {
        zip: String(input.zip || '').replace(/\D/g, ''),
        state: String(input.state || '').trim(),
        city: String(input.city || '').trim(),
        address: String(input.address || '').trim(),
        number: String(input.number || '').trim(),
        district: String(input.district || '').trim(),
        complement: String(input.complement || '').trim(),
      };
      if (addressData.address.length < 3 || addressData.city.length < 2 || addressData.state.length < 2) {
        return res.status(422).json({ message: "Informe um endereço válido." });
      }
      const existingAddress = await PeopleAddress.findOne({ where: { peopleId: person.id }, order: [['id', 'ASC']] });
      if (existingAddress) await existingAddress.update(addressData);
      else await PeopleAddress.create({ peopleId: person.id, ...addressData, isPrimary: true });
    }

    const company = await Company.findByPk(person.companyId);
    const address = await PeopleAddress.findOne({ where: { peopleId: person.id }, order: [['id', 'ASC']] });
    const response: any = this.tokenFor(person, company);
    response.data.address = address?.toJSON() || null;
    return res.json(response);
  }

  @TryCatch()
  async requestPhoneChange(req: Request, res: Response): Promise<Response> {
    const phone = normalizePhone(req.body.phone);
    if (phone.length < 10) return res.status(422).json({ message: "Informe um WhatsApp válido." });
    const person = await this.currentPerson(req);
    if (!person) return res.status(403).json({ message: "Acesso ao painel não autorizado." });
    const conflict = await People.findOne({ where: { companyId: person.companyId, ...phoneWhere(phone), id: { [Op.ne]: person.id } } });
    if (conflict) return res.status(409).json({ message: "Este WhatsApp já está vinculado a outro cliente." });
    const code = String(gerarCodigoUnico());
    let digits = phone.startsWith('55') ? phone.slice(2) : phone;
    const waId = digits.length >= 10 ? `${digits.slice(0, 2)}${digits.slice(-8)}` : digits;
    await person.update({ phoneCode: code, phoneCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), phoneChangeNumber: phone, phoneChangeWaId: waId });
    const sent = await SendWhatsapp({ to: phone.startsWith('55') ? phone : `55${phone}`, message: `Seu código para alterar o WhatsApp é ${code}. Ele expira em 10 minutos.` });
    if (!sent.success) return res.status(422).json({ message: sent.message || "Não foi possível enviar o código pelo WhatsApp." });
    return res.json({ message: "Código enviado para o novo WhatsApp." });
  }

  @TryCatch()
  async confirmPhoneChange(req: Request, res: Response): Promise<Response> {
    const person = await this.currentPerson(req);
    const code = String(req.body.code || "").trim();
    if (!person) return res.status(403).json({ message: "Acesso ao painel não autorizado." });
    if (!code) return res.status(422).json({ message: "Informe o código recebido." });
    const valid = await People.findOne({ where: { id: person.id, companyId: person.companyId, phoneCode: code, phoneCodeExpiresAt: { [Op.gt]: new Date() } } });
    if (!valid?.phoneChangeNumber) return res.status(401).json({ message: "Código inválido ou expirado." });
    await valid.update({ phoneNumber: valid.phoneChangeNumber, waId: valid.phoneChangeWaId, phoneChangeNumber: null, phoneChangeWaId: null, phoneCode: null, phoneCodeExpiresAt: null });
    const company = await Company.findByPk(valid.companyId);
    return res.json(this.tokenFor(valid, company));
  }

  @TryCatch()
  async requestCode(req: Request, res: Response): Promise<Response> {
    const phone = normalizePhone(req.body.phone);
    const name = String(req.body.name || "").trim();
    if (phone.length < 10) return res.status(422).json({ message: "Informe um WhatsApp válido." });

    const company = await companyFromRequest(req);
    if (!company?.active || !company.customerPortalEnabled) return res.status(404).json({ message: "Painel do cliente indisponível." });

    const code = String(gerarCodigoUnico());
    let person = await People.findOne({ where: { companyId: company.id, ...phoneWhere(phone) } });
    if (!person) {
      person = await People.create({
        companyId: company.id,
        personType: 1,
        typeId: 1,
        legalName: name || "Cliente",
        tradeName: name || "Cliente",
        phoneNumber: phone,
        waId: phone,
        active: true,
        customerPortalAccess: !company.customerPortalApprovalRequired,
      } as any);
    } else if (!person.customerPortalAccess) {
      return res.status(403).json({ message: "Este cliente ainda não tem acesso ao painel." });
    }
    await person.update({
      legalName: name || person.legalName || "Cliente",
      tradeName: name || person.tradeName || "Cliente",
      phoneCode: code,
      phoneCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const whatsappPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const sent = await SendWhatsapp({ to: whatsappPhone, message: `Seu código de acesso é ${code}. Ele expira em 10 minutos.` });
    if (!sent.success) return res.status(422).json({ message: sent.message || "Não foi possível enviar o código pelo WhatsApp." });
    return res.json({ message: "Código enviado para o WhatsApp." });
  }

  @TryCatch()
  async verifyCode(req: Request, res: Response): Promise<Response> {
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || "").trim();
    const company = await companyFromRequest(req);
    if (!company?.active || !company.customerPortalEnabled) return res.status(404).json({ message: "Painel do cliente indisponível." });
    const person = await People.findOne({ where: { companyId: company.id, active: true, phoneCode: code, phoneCodeExpiresAt: { [Op.gt]: new Date() }, ...phoneWhere(phone) } });
    if (!person) return res.status(401).json({ message: "Código inválido ou expirado." });

    if (!person.customerPortalAccess) return res.status(403).json({ code: 'PORTAL_PENDING_APPROVAL', message: "Sua conta está pendente de aprovação." });

    await person.update({ phoneCode: null, phoneCodeExpiresAt: null });
    return res.json(this.tokenFor(person, company));
  }
}

export default new CustomerAuthController();
