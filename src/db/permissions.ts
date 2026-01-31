
// nivel 0 => master
// nivel 1 => cliente

const permissions = [

  {id: 1, def: 1, nivel: [0,1], group: 'Usuários', name: 'Acessar', key: 'user-index', desc: ''},
  {id: 2, def: 1, nivel: [0,1], group: 'Usuários', name: 'Adicionar', key: 'user-create', desc: ''},
  {id: 3, def: 1, nivel: [0,1], group: 'Usuários', name: 'Atualizar', key: 'user-update', desc: ''},
  {id: 4, def: 1, nivel: [0,1], group: 'Usuários', name: 'Deletar', key: 'user-delete', desc: ''},

  {id: 5, def: 1, nivel: [0,1], group: 'Permissão', name: 'Acessar', key: 'role-index', desc: ''},
  {id: 6, def: 1, nivel: [0,1], group: 'Permissão', name: 'Adicionar', key: 'role-create', desc: ''},
  {id: 7, def: 1, nivel: [0,1], group: 'Permissão', name: 'Atualizar', key: 'role-update', desc: ''},
  {id: 8, def: 1, nivel: [0,1], group: 'Permissão', name: 'Deletar', key: 'role-delete', desc: ''},

  {id: 9, def: 1, nivel: [0,1], group: 'Empresa Dados', name: 'Acessar', key: 'company-setting-update', desc: ''},

  {id: 10, def: 1, nivel: [0,1], group: 'Produto', name: 'Acessar', key: 'product-index', desc: ''},
  {id: 11, def: 1, nivel: [0,1], group: 'Produto', name: 'Adicionar', key: 'product-create', desc: ''},
  {id: 12, def: 1, nivel: [0,1], group: 'Produto', name: 'Atualizar', key: 'product-update', desc: ''},
  {id: 13, def: 1, nivel: [0,1], group: 'Produto', name: 'Deletar', key: 'product-delete', desc: ''},

  {id: 14, def: 1, nivel: [0,1], group: 'Categoria', name: 'Acessar', key: 'category-index', desc: ''},
  {id: 15, def: 1, nivel: [0,1], group: 'Categoria', name: 'Adicionar', key: 'category-create', desc: ''},
  {id: 16, def: 1, nivel: [0,1], group: 'Categoria', name: 'Atualizar', key: 'category-update', desc: ''},
  {id: 17, def: 1, nivel: [0,1], group: 'Categoria', name: 'Deletar', key: 'category-delete', desc: ''},

  {id: 18, def: 1, nivel: [0,1], group: 'Marca', name: 'Acessar', key: 'brand-index', desc: ''},
  {id: 19, def: 1, nivel: [0,1], group: 'Marca', name: 'Adicionar', key: 'brand-create', desc: ''},
  {id: 20, def: 1, nivel: [0,1], group: 'Marca', name: 'Atualizar', key: 'brand-update', desc: ''},
  {id: 21, def: 1, nivel: [0,1], group: 'Marca', name: 'Deletar', key: 'brand-delete', desc: ''},

  {id: 22, def: 1, nivel: [0,1], group: 'Grupo', name: 'Acessar', key: 'group-index', desc: ''},
  {id: 23, def: 1, nivel: [0,1], group: 'Grupo', name: 'Adicionar', key: 'group-create', desc: ''},
  {id: 24, def: 1, nivel: [0,1], group: 'Grupo', name: 'Atualizar', key: 'group-update', desc: ''},
  {id: 25, def: 1, nivel: [0,1], group: 'Grupo', name: 'Deletar', key: 'group-delete', desc: ''},

  {id: 26, def: 1, nivel: [0,1], group: 'SubGrupo', name: 'Acessar', key: 'subgroup-index', desc: ''},
  {id: 27, def: 1, nivel: [0,1], group: 'SubGrupo', name: 'Adicionar', key: 'subgroup-create', desc: ''},
  {id: 28, def: 1, nivel: [0,1], group: 'SubGrupo', name: 'Atualizar', key: 'subgroup-update', desc: ''},
  {id: 29, def: 1, nivel: [0,1], group: 'SubGrupo', name: 'Deletar', key: 'subgroup-delete', desc: ''},

  {id: 30, def: 1, nivel: [0,1], group: 'Tipo de entrega', name: 'Acessar', key: 'delivery-type-index', desc: ''},
  {id: 31, def: 1, nivel: [0,1], group: 'Tipo de entrega', name: 'Adicionar', key: 'delivery-type-create', desc: ''},
  {id: 32, def: 1, nivel: [0,1], group: 'Tipo de entrega', name: 'Atualizar', key: 'delivery-type-update', desc: ''},
  {id: 33, def: 1, nivel: [0,1], group: 'Tipo de entrega', name: 'Deletar', key: 'delivery-type-delete', desc: ''},

  {id: 34, def: 1, nivel: [0,1], group: 'Forma de pagamento', name: 'Acessar', key: 'payment-method-index', desc: ''},
  {id: 35, def: 1, nivel: [0,1], group: 'Forma de pagamento', name: 'Adicionar', key: 'payment-method-create', desc: ''},
  {id: 36, def: 1, nivel: [0,1], group: 'Forma de pagamento', name: 'Atualizar', key: 'payment-method-update', desc: ''},
  {id: 37, def: 1, nivel: [0,1], group: 'Forma de pagamento', name: 'Deletar', key: 'payment-method-delete', desc: ''},

  // {id: 9, def: 1, nivel: [0,1], group: 'Categoria', name: 'Acessar', key: 'category-index', desc: ''},
  // {id: 10, def: 1, nivel: [0,1], group: 'Departamento', name: 'Acessar', key: 'departament-index', desc: ''},

];

//
// export const permissionsByGroup = () => {
//   const grouped = permissions.reduce((acc, item) => {
//     if (!acc[item.group]) {
//       acc[item.group] = [];
//     }
//     acc[item.group].push({ name: item.key, title: item.name });
//     return acc;
//   }, {});
//
//   // Transformar para o modelo desejado
//   return  Object.entries(grouped).map(([group, list]) => ({
//     title: group,
//     list,
//   }));
// }

export const permissionsDefaultAdmin = () => {
  return permissions.filter(f => (f.nivel.includes(1))).map(item => {
    return `${item.id}:${item.def}`
  }).join('|');
}

export const listAllPermissions = () => {

  const grouped = Object.values(
    permissions.reduce((acc, perm) => {
      if (!acc[perm.group]) {
        acc[perm.group] = {
          title: perm.group,
          type: 'checkbox',
          nivel: perm.nivel,
          list: []
        };
      }

      acc[perm.group].list.push({
        name: perm.name,
        desc: perm.desc,
        id: perm.id,
      });

      return acc;
    }, {})
  );

  return grouped;
}

export default permissions;
