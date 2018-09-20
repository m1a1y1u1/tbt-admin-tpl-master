let url = '/api/v1'
exports.login = url + '/login'// 登陆
exports.register = url + '/register'// 注册
exports.loginOut = url + '/loginOut'// 登出
// 七牛相关
exports.qiniuUploadLink = 'http://upload.qiniup.com'// 七牛外链域名地址（暂用）
exports.qiniuImagePreLink = 'http://pf8cnlnaw.bkt.clouddn.com/'// 七牛外链域名地址（暂用）
exports.qiniuToken = url + '/getQiniuToken'// 获取七牛Token,用于上传

// 角色管理相关
exports.roleAdd = url + '/role/add'// 添加角色
exports.roleUpdate = url + '/role/update'// 更新角色
exports.roleList = url + '/role/list'// 角色列表查询
exports.roleListAll = url + '/role/listAll'// 角色列表查询

// 用户管理相关
exports.userAdd = url + '/user/add'// 添加用户
exports.userUpdate = url + '/user/update'// 更新用户
exports.userList = url + '/user/list'// 用户列表查询
exports.userDelete = url + '/user/delete'// 用户列表查询
exports.userUpdateStatus = url + '/user/updateStatus'// 用户状态更新

// 项目相关
exports.sysProjectAdd = url + '/sysproject/add'// 添加项目
exports.sysProjectDelete = url + '/sysproject/delete'// 删除项目
exports.sysProjectLogicDelete = url + '/sysproject/logicDelete'// 逻辑删除项目
exports.sysProjecUpdateRecommended = url + '/sysproject/updateRecommended'// 项目状态更改
exports.sysProjecUpdate = url + '/sysproject/update'// 更新项目
exports.sysProjectList = url + '/sysproject/list'// 项目分页列表查询
exports.sysProjectListAll = url + '/sysproject/listAll'// 项目所有列表查询
exports.sysProjectImgUpload = url + '/sysproject/imgUpload'// 项目分页列表查询
exports.sysProjectExtraInfoList = url + '/sysproject/findExtraInfoList'// 获取项目关联信息

// 项目团队成员相关
exports.sysProjectTeamInfoDelete = url + '/sysprojectteaminfo/delete'// 删除指定id的项目成员

// 项目里程碑事件相关
exports.sysProjectMilepostDelete = url + '/sysprojectmilepost/delete'// 删除指定id的项目里程碑事件

// 项目热度相关
exports.sysProjectsPopularityDelete = url + '/sysprojectpopularity/delete'// 删除指定id的项目热度记录

// app banner 布局信息相关
exports.layoutBannerList = url + '/layoutbanner/list'// 分页
exports.layoutBannerAdd = url + '/layoutbanner/add'// 添加
exports.layoutBannerDelete = url + '/layoutbanner/delete'// 删除
exports.layoutBannerUpdate = url + '/layoutbanner/update'// 修改

// 行政区域划分相关
exports.dtCountryList = url + '/dtcountry/list'// 国家字典分页
exports.dtCountryAll = url + '/dtcountry/findAll'// 国家字典所有数据

// 系统字典查询相关
exports.findDictionaryListByModels = url + '/dictionary/findListByModels'// 根据字典模块，获取模块分组信息列表
exports.dictionaryList = url + '/dictionary/list'// 根据字典模块，获取模块分组信息列表
