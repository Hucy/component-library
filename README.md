# 日期选择

## 功能

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
  + 大小以挂载节点`el`宽度
  + 若`el`为输入框则大小与输入框一致
  + 顶层自定义样式钩子
  + `年`,`月`一行4个选择节点
  + `日` 一行7个选择节点
- 日期
  + 初始日期,默认为当期日期,取值为:
    * 格式化后的日期,以设置的格式化为准
  + 最大和最小日期:
    * 联动取值绑定另一个日期选择器
  + 格式化,默认`yyyy-mm-dd`
- 节点模板:
  + 提供渲染函数,参数为日期对象:
  ```js
   {   /**
       *dateObj:{
           date:'yyyy-mm-dd',//以格式化格式为准
           year:'yyyy',
           month:'mm',
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
  + `nodeEventCb({eventType:cb})`节点事件绑定
  ## 选项说明

  ```js
  new window.componentLibrary.DatePicker({
            el: '#example',
            type:'days',
            customizeClass:'my-date-picker',
            format:'yyyy-mm-dd',
            currentDate:'2017-01-01',
            maxDate:'2017-02-08',
            minDate:'2017-01-01',  
            render:function(dateObj,data){
              return dateObj.date+data+'test'
            },
            data:function(dateArr,cb){
               var _this = this
            setTimeout(function() {
                var data = new Array(dataArr.length).fill('test')
                cb.call(_this, data)
            }, 500)
            },
            beforeInit:function(DatePicker){
              //code
            },
            inited:function(DatePickerElment,DatePicker){
              //code 
            },
            beforeDestroy:function(DatePickerElment,DatePicker){
              //code
            },
            destroyed:function(DatePicker){
              //code
            },
            nextCb:function(DatePicker){
              //code
            },
            prevCb:function(DatePicker){
              //code
            },
            nodeClickCb:function(dateNode,DatePicker){
              //code
            },
            nodeEvent:{
              'eventType':function(dateNode,e,DatePicker){
                //code
              }
            }
        })
  ```
- `el {string}` : 
  + 描述: 挂载节点; 
  + 取值: css选择器;   
  + 默认值:`'body'`;
  + 备注:
- `type {string}`:
  + 描述: 视图类型; 
  + 取值: 'days'|'months'|'years';   
  + 默认值:`'days'`;
  + 备注:
- `customizeClass {string}`:
  + 描述: 自定义样式类; 
  + 取值: ;   
  + 默认值:`'date-picker-defalut'`;
  + 备注:更改组件样式通过此样式类更改
- `format {string}`:
  + 描述: 显示日期格式; 
  + 取值: `yyyy{-}mm{-}dd`;   
  + 默认值:`yyyy-mm-dd`;
  + 备注:`yyyy`表示年份,`mm`表示月份,`dd`表示日期
- `currentDate {string}`:
  + 描述: 当前日期; 
  + 取值: 符合`format`格式的日期字符串;   
  + 默认值:当期日期;
  + 备注:
- `maxDate {string|DatePicker}`:
  + 描述: 最大日期限制; 
  + 取值: 符合`format`格式的日期字符串或者一个`DatePicker`的实例;   
  + 默认值:`''`;
  + 备注:当期日期大于最大日期时,取最大日期
- `minDate {string|DatePicker}`:
  + 描述: 最小日期限制; 
  + 取值: 符合`format`格式的日期字符串或者一个`DatePicker`的实例;   
  + 默认值:`''`;
  + 备注:当期日期小于最小日期时,取最小日期
- `render {function(Object, *):string}`:
  + 描述: 自定义节点渲染函数; 
  + 取值: 
    ```
     
      /**
        * 
        * 
        * @param {Object} dateObj {date:,year:month:,day:}
        * @param {any} data
        * @returns {string}
        */
      function(dateObj,data){
          return dateObj.date+data+'test'
        }
  
     ```   
  + 默认值:`''`;
  + 备注:仅当`type`为`days`有效,其中`data`参数依赖`data`选项
- `data {function(array, function)}`:
  + 描述: 自定义节点渲染时的数据获取函数; 
  + 取值: 
    ```
     
      /**
        * 
        * 
        * @param {Array.<dateObj>} dateArr
        * @param {Function} cb
        * @returns 
        */
        function(dataArr,cb){
            //保存当前`DatePicker`实例
               var _this = this
            //异步操作
            setTimeout(function() {
                var data = new Array(dataArr.length).fill('test')
            //以当前`DatePicker`实例作为`this`执行回调函数
                cb.call(_this, data)
            }, 500)
          },
  
     ```   
  + 默认值:`''`;
  + 备注:仅当`render`不为`''`时有效,其中`cb`必须以当前`DatePicker`实例作为`this`调用