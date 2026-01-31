import UserHistoric from "../models/UserHistoric";

type Param = {
  userId: number;
  companyId: number;
  action: string;
  model: string;
  modelId: number;
  oldData: any;
  newData: any;
};

const UserHistoricService = async({
userId, companyId, action, model, modelId, oldData, newData
}:Param) => {


  await UserHistoric.create({
    userId,
    companyId,
    action,
    entity: model,
    entityId: modelId,
    oldData: JSON.stringify(oldData),
    newData: JSON.stringify(newData),
  });

};

export default UserHistoricService;
