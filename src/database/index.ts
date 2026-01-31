import { Sequelize } from "sequelize-typescript";
import Company from "../models/Company";
import User from "../models/User";
import Plan from "../models/Plan";
import Role from "../models/Role";
import {AddOverrideQuery} from "./sequelizeExtension";
import PasswordRecovery from "../models/PasswordRecovery";
import UserLoginHistoric from "../models/UserLoginHistoric";
import UserSession from "../models/UserSession";
import Group from "../models/Group";
import SubGroup from "../models/SubGroup";
import People from "../models/People";
import PeopleAddress from "../models/PeopleAddress";
import Variant from "../models/Variant";
import VariantItem from "../models/VariantItem";
import Category from "../models/Category";
import UserHistoric from "../models/UserHistoric";
import Subscription from "../models/Subscription";
import SubscriptionProduct from "../models/SubscriptionProduct";
import SubscriptionHistoric from "../models/SubscriptionHistoric";
import Brand from "../models/Brand";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import DeliveryType from "../models/DeliveryType";
import Filter from "../models/Filter";
import FilterItem from "../models/FilterItem";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import OrderStatus from "../models/OrderStatus";
import PaymentMethod from "../models/PaymentMethod";
import ProductImage from "../models/ProductImage";
import ProductTag from "../models/ProductTag";
import ProductFilterItem from "../models/ProductFilterItem";
import ShippingRule from "../models/ShippingRule";
import ShippingNeighborhod from "../models/ShippingNeighborhod";
import ShippingCep from "../models/ShippingCep";
import Tag from "../models/Tag";


const dbConfig = require("../config/database");

export const sequelize = new Sequelize(dbConfig);

sequelize.addModels([
  Company,
  User,
  Plan,
  Role,
  PasswordRecovery,
  UserLoginHistoric,
  UserSession,
  Group,
  SubGroup,
  Brand,
  People,
  PeopleAddress,
  Category,
  Variant,
  VariantItem,
  UserHistoric,
  Subscription,
  SubscriptionProduct,
  SubscriptionHistoric,
  Product,
  Coupon,
  DeliveryType,
  Filter,
  FilterItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ProductImage,
  ProductTag,
  ProductFilterItem,
  ShippingRule,
  ShippingNeighborhod,
  ShippingCep,
  Tag
]);

AddOverrideQuery();

export default sequelize;
