import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import Company from "../../models/Company";

class CompanyController {
  constructor() {
    this.show = this.show.bind(this);
  }

  async show(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;

      const company = await Company.findOneWithCache(companyId, {
        where:{id:companyId}
      });

      const item = {
        colorPrimary:company.colorPrimary,
        colorSecondary:company.colorSecondary,
        themeMode: company.themeMode || 'dark',
        darkBackground: company.darkBackground || '#202124',
        productCardType:company.productCardType || "right_square",
        categoryVisibleCount: company.categoryVisibleCount ?? 6,
        recommendedVisibleCount: company.recommendedVisibleCount ?? 3,
        promotionVisibleCount: company.promotionVisibleCount ?? 3,
        pointsEnabled: company.pointsEnabled ?? false,
        pointValue: Number(company.pointValue ?? 1),
        pointCashValue: Number(company.pointCashValue ?? 0.01),
        customerPortalEnabled: company.customerPortalEnabled ?? false,
        customerPortalApprovalRequired: company.customerPortalApprovalRequired ?? false,
        siteTitle:company.siteTitle,
        siteSubTitle:company.siteSubTitle,
        contactEmail:company.contactEmail,
        contactWhatsapp:company.contactWhatsapp,
        logotipo:company.logotipo,
        address:company.address,
        schedule:company.schedule,
        isOrder:company.isOrder,
        isFrete:company.isFrete,
        backgroundBannerStyle: company.backgroundBannerStyle || 'cart',
        headerBackgroundColor: company.headerBackgroundColor || '#242424',
        backgroundIconPattern: company.backgroundIconPattern || 'mercado',
        backgroundIconColor: company.backgroundIconColor || company.colorPrimary || null,
        backgroundIconOpacity: company.backgroundIconOpacity ?? 0.6,
      };

      return responseSuccess(res, [item]);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Order.store');
    }
  }


}

export default new CompanyController();
