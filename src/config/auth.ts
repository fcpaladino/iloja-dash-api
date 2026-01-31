export default {
  secret: process.env.JWT_SECRET || "601dbaf0bcd83458b99dca10e174036c",
  expiresIn: "1d",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "95fd56a4402c168986ee942531752b46",
  refreshExpiresIn: "7d"
};
