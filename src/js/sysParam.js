// 框架
var host = "http://192.168.1.103:8081";//主机地址
var loginPage = "file:///C:/workspace/xcfang-web/dist/html/sys/login.html";//登录地址
var indexPage = "file:///C:/workspace/xcfang-web/dist/html/operate/city-list.html";//首页地址

// 公用枚举
common_oper_state_enum = "L=未绪&R=就绪&S=成功&F=失败";//状态表操作状态
common_repay_state_enum = "PAID=已结清&PREV_NOTYET=提前结清&NORMAL_NOTYET=正常结清&OVER_NOTYET=逾期结清&OVER_DUE=逾期&NORMAL=未结清";//还款状态
common_repay_isOver_enum = "Y=逾期&N=正常";//是否逾期
common_loan_state_enum = "10=待放款&20=待生成还款计划&30=待还款&40=已结清&50=坏账";//贷款状态
common_loan_payState_enum="NOT_PAY=未放款&PAID=已放款";//放款状态
common_repay_mode_enum="M0000001=等额本息&M0000002=按月付息到期还本&M0000003=等额本金&M0000004=按季付息到期还本&M0000005=等额本息";//还款方式
common_term_type_enum="DAY=天&WEEK=周&MONTH=月&SEASON=季&YEAR=年";//贷款期限类型

//正则表达式
common_pattern_date=/^[2]\d{3}[0|1][1-9][0-3][1-9]$/;//日期 yyyyMMdd
