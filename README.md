## 日期选择

### 功能

- 按照初始显示设置生成对应样式:
  + 年
  + 月
  + 日
- 触发方式:
  +  绑定到输入框,获得焦点时触发
  +  通过`new`之后调用`show`触发
- 定位方式:
  + `el`挂载节点绝对定位,默认位置为节点下方
  + `el`默认`body`,位置居中
- 默认样式:
  + 大小以挂载节点`el`字体大小`10em`
  + 若`el`为输入框则大小与输入框一致
  + 顶层自定义样式钩子
  + `年`,`月`一行4个选择节点
  + `日` 一行7个选择节点
- 日期
  + 初始日期,默认为当期日期,取值为:
    * 毫秒值
    * 格式化后的日期,以设置的格式化为准
  + 最大和最小日期:
    * 同初始日期取值
    * 联动取值绑定另一个日期选择器
  + 格式化,默认`yyyy-mm-dd`
- 节点模板:
  + 提供渲染函数,参数为日期对象:
  ```js
   {   /**
       *dateObj:{
           date:'yyyy-mm-dd',//以格式化格式为准
           year:'yyyy',
           months:'mm',
           day:'dd'
       }
       */
       render:function(dateObj){
           // 返回节点字符串
            return '<div>'+
                   '<span>当期日期为:'+
                   dataObj.date+
                   '</span></div>'
       }
   }
  ```  
- 周期钩子
  +  `beforeInit` 初始化之前调用
  + `inited` 初始化之后调用
  + `beforeDestroy` 销毁之前调用
  + `destroyed`销毁之后调用
- 实例方法
  + `show` 显示
  + `hide`隐藏
  + `remove`移除
  + `next`下一个日期
  + `prev`上一个日期
- 事件钩子
  + `nextCb`下一个日期
  + `prevCb`上一个日期
  + `nodeClickCb(dateObj)` 节点点击事件
  + `nodeEventCb(eventType,cb)`节点事件绑定
  