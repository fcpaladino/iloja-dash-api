
import {FindAndCountOptions, Utils} from "sequelize";
import { AssociationActionOptions, Model, ModelStatic } from "sequelize-typescript";
import { Attributes, CountOptions, CreateOptions, CreationAttributes, DestroyOptions, FindOptions, Identifier, InstanceDestroyOptions, InstanceUpdateOptions, UpdateOptions } from "sequelize/types/model";
import { Col, Fn, Literal } from "sequelize/types/utils";
import paginate from "../config/paginate";
import {paginatedResponse} from "../helpers/PaginatedResponse";



const msgErro = "companyId is required when using cached queries.";

interface PaginateParams<T> extends Omit<FindAndCountOptions<T>, 'limit' | 'offset'> {
  page?: number;
  limit?: number;
}

interface PaginatedResponse {
  items: any[];
  count?: number;
  hasMore?: boolean;
  meta: {
    totalItems: number;
    totalPage: number;
    activePage: number;
    limitPage: number
  };
}

export class BaseModel<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes> extends Model<TModelAttributes, TCreationAttributes> {

  public static async paginate<T extends Model>(this: ModelStatic<T>, companyId: number, params: PaginateParams<T>): Promise<PaginatedResponse> {
    const {
      page = 1,
      limit = paginate.itemsByPage,
      ...options
    } = params;

    const pageNumber = page === 0 ? 1 : page;
    const offset = limit * (pageNumber - 1);

    const { count, rows } = await (this as any).findAndCountAll({
      ...options,
      limit,
      offset: offset < 0 ? 0 : offset,
    });

    return {
      items: rows,
      meta: {
        totalItems: count,
        totalPage: Math.ceil(count / limit),
        activePage: parseInt(String(pageNumber)),
        limitPage: limit,
      },
    };
  }

  public static async paginateWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, params: PaginateParams<T>): Promise<PaginatedResponse> {
    const {
      page = 1,
      limit = paginate.itemsByPage,
      ...options
    } = params;

    const pageNumber = page === 0 ? 1 : page;
    const offset = limit * (pageNumber - 1);

    const { count, rows } = await (this as any).findAndCountAllWithCache(companyId, {
      ...options,
      limit,
      offset: offset < 0 ? 0 : offset,
    });

    return {
      items: rows,
      meta: {
        totalItems: count,
        totalPage: Math.ceil(count / limit),
        activePage: parseInt(String(pageNumber)),
        limitPage: limit,
      },
    };

    // return paginatedResponse(rows, parseInt(count), limit, pageNumber);
  }

  public static async findByPkWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, identifier?: Identifier, options?: FindOptions<Attributes<T>>): Promise<T | null> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const data = await (this as any).findByPk(identifier, newOptions);

    return data;

  }

  public static async findOneWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: FindOptions<Attributes<T>>): Promise<T | null> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const data = await (this as any).findOne(newOptions);

    return data;

  }

  public static async findAllWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: FindOptions<Attributes<T>>): Promise<T[] | null> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const data = await (this as any).findAll(newOptions);

    return data;

  }

  public static async countWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: CountOptions<Attributes<T>>): Promise<number | null> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const data = await (this as any).count(newOptions);

    return data;

  }

  public static async updateWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, values: Partial<Attributes<T>>, options?: UpdateOptions<Attributes<T>>): Promise<[number, T[]]> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const result = await (this as any).update(values, newOptions);

    return result;
  }


  public static async createWithCache<T extends Model, O extends CreateOptions<Attributes<T>> = CreateOptions<Attributes<T>>>(this: ModelStatic<T>, companyId: number, values?: CreationAttributes<T>, options?: O): Promise<O extends { returning: false } | { ignoreDuplicates: true } ? void : T> {
    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const result = await (this as any).create(values, newOptions);

    return result;

  }


  public static async destroyWithCache<M extends Model>(this: ModelStatic<M>, companyId: number, options?: DestroyOptions<Attributes<M>>,): Promise<number> {

    if (companyId <= 0)
      throw new Error(msgErro);

    const newOptions = { ...options, UseCache: true, companyId };
    const result = await (this as any).destroy(newOptions);

    return result;

  }

  public static async findAndCountAllWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: FindOptions<Attributes<T>>): Promise<{ count: number; rows: T[] }> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }


    const newOptions = { ...options, UseCache: true, companyId };
    const newCountOptions = { ...options, UseCache: true, companyId, isCount: true };

    const [count, rows] = await Promise.all([
      (this as any).count(newCountOptions),
      (this as any).findAll(newOptions)
    ]);


    return { count, rows }


  }

  public static async findOrCreateWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: FindOptions<Attributes<T>> & { defaults?: Partial<Attributes<T>> }): Promise<[T, boolean]> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }

    const newOptions = { ...options, UseCache: true, companyId };

    const found = await (this as any).findOne(newOptions);
    if (found !== null) {
      return [found, false];
    }

    const values = options.defaults;
    const created = await (this as any).create(values, newOptions);
    return [created, true];

  }


  public static async upsertWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, values: Partial<Attributes<T>>, options?: UpdateOptions<Attributes<T>>): Promise<[T, boolean]> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }

    const newOptions = { ...options, UseCache: true, companyId, returning: options?.returning ?? true };
    const [instance, created] = await (this as any).upsert(values, newOptions);

    return [instance, created];

  }


  // ========================================================================
  // Métodos de instância)
  // ========================================================================
  public async updateWithCache<K extends keyof any>(companyId: number, keys: { [key in keyof TModelAttributes]?: TModelAttributes[key] | Fn | Col | Literal | any; }, options?: InstanceUpdateOptions<TModelAttributes>): Promise<this> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }

    const newOptions = { ...options, UseCache: true, companyId };
    const ret = await this.update(keys as any, newOptions);
    return ret;
  }

  public async destroyWithCache(companyId: number, options?: InstanceDestroyOptions): Promise<void> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }

    const newOptions = { ...options, UseCache: true, companyId };
    const ret = await this.destroy(newOptions);

    return

  }

  public async reloadWithCache(companyId: number, options?: any): Promise<this> {

    if (companyId <= 0) {
      throw new Error(msgErro);
    }


    options = (Utils as any).defaults({ where: this.where() }, options, { include: (this as any)._options.include });
    const newOptions = { ...options, UseCache: true, companyId };
    const reloaded = await (this.constructor as any).findOne(newOptions);
    (this as any).options = reloaded._options;
    this.set(reloaded.dataValues, { raw: true, reset: !options?.attributes });

    return this;

  }

  public async $setWithCache<R extends Model>(companyId: number, propertyKey: keyof this, instances: R | R[] | string[] | string | number[] | number | null, assocOptions?: AssociationActionOptions): Promise<this> {

    try {

      if (companyId <= 0) {
        throw new Error(msgErro);
      }

      const newOptions = { ...assocOptions, UseCache: true, companyId };
      await (this as any).$set(propertyKey, instances, newOptions)

      return this

    } catch (error) {
      console.error("Error in $setWithCache:", error);
    }



  }









  // ========================================================================
  // Métodos adicionais (estáticos e de instância) não implementados:
  // Todos retornarão um erro "Not implemented"
  // ========================================================================


  public static async findOrBuildWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, options?: FindOptions<Attributes<T>> & { defaults?: Partial<Attributes<T>> }): Promise<[T, boolean]> { throw new Error("Not implemented"); }
  public static async aggregateWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, field: keyof Attributes<T>, aggregateFunction: string, options?: FindOptions<Attributes<T>>): Promise<any> { throw new Error("Not implemented"); }
  public static async maxWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, field: keyof Attributes<T>, options?: FindOptions<Attributes<T>>): Promise<number | null> { throw new Error("Not implemented"); }
  public static async minWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, field: keyof Attributes<T>, options?: FindOptions<Attributes<T>>): Promise<number | null> { throw new Error("Not implemented"); }
  public static async sumWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, field: keyof Attributes<T>, options?: FindOptions<Attributes<T>>): Promise<number | null> { throw new Error("Not implemented"); }
  public static async incrementWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, fields: (keyof Attributes<T>)[] | keyof Attributes<T>, options?: UpdateOptions<Attributes<T>>): Promise<T> { throw new Error("Not implemented"); }
  public static async decrementWithCache<T extends Model>(this: ModelStatic<T>, companyId: number, fields: (keyof Attributes<T>)[] | keyof Attributes<T>, options?: UpdateOptions<Attributes<T>>): Promise<T> { throw new Error("Not implemented"); }
  public async saveWithCache(options?: any): Promise<this> { throw new Error("Not implemented"); }





}












