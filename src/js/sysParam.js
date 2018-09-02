// 框架
var host = "http://192.168.0.104:8081";//主机地址
var loginPage = "file:///C:/workspace/xcfang-web/dist/html/sys/login.html";//登录地址
var indexPage = "file:///C:/workspace/xcfang-web/dist/html/user/user-index.html";//首页地址

// 公用枚举
common_number_enum="0=0&1=1&2=2&3=3&4=4&5=5&6=6&7=7&8=8&9=9";//常用9以内数字选项
common_boolean_enum="0=否&1=是";//常用是否选项
common_village_build_type_enum="plate=板楼&tower=塔楼&all=板塔结合";//小区建筑类型
common_village_unit_type_enum="number=号&unit=单元&build=幢";//小区单元单位
common_house_thisFloorType="low=低楼层&medium=中等楼层&high=高楼层";//房源楼层级别
common_house_direction="east=东&south=南&west=西&north=北";//房源朝向
common_house_decoration="none=毛坯&simple=简装&medium=中装&hardcover=精装&luxury=豪装";//房源装修情况
common_house_type="top=高档住宅&ordinary=普通住宅&apartment=公寓式住宅&villa=别墅&factory=厂房&shops=商铺";//房源住房种类
common_house_methodType="goods=商品房&displace=动迁房";//房源房屋种类

//正则表达式
common_pattern_date=/^[2]\d{3}[0|1][1-9][0-3][1-9]$/;//日期 yyyyMMdd
