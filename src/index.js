// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.componentLibrary = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    var DatePicker = function(paramObj) {

        this.option = paramObj || {}
        this.el = this.option.el || 'body'
        this.type = this.option.type || 'days'
        this.customizeClass = this.option.customizeClass || ''
        this.currentDate = this.option.currentDate || ''
        this.maxDate = this.option.maxDate || ''
        this.minDate = this.option.minDate || ''
        this.render = this.option.render || ''
        this.beforeInit = this.option.beforeInit || ''
        this.inited = this.option.inited || ''
        this.beforeDestroy = this.option.beforeDestroy || ''
        this.destroyed = this.option.destroyed || ''
        this.nextCb = this.option.nextCb || ''
        this.prevCb = this.option.prevCb || ''
        this.nodeClickCb = this.option.nodeClickCb || ''
        this.nodeEventCb = this.option.nodeEventCb || ''
        this.format = this.option.format || 'yyyy-mm-dd'
        this._startUp()
    }

    DatePicker.prototype = {
        constructor: DatePicker,
        _startUp: function() {
            this._beforeInit()
            this._init()
        },
        _replaceArr_: function() {
            var arr = this.slice()
            Array.prototype.splice.apply(arr, arguments)
            return arr
        },
        /**
         * 统一的时间处理
         */
        _dateHandle: function(dateString) {
            var dateRegExp = new RegExp(this.format
                .replace('yyyy', '([0-9]{4})')
                .replace('mm', '([0-9]{2})')
                .replace('dd', '([0-9]{2})'))
            var originDateArr = dateString.match(dateRegExp).slice(1, 4)
            originDateArr.splice(1, 1, originDateArr[1] - 1)
            return originDateArr
        },
        _dateToTime: function(dateArr) {
            return Date.UTC.apply(Date, dateArr.concat([0, 0, 0, 0]))
        },
        _data: function(dateArr) {
            return {
                date: this._dateFormat(this._dateToTime(dateArr)),
                year: dateArr[0],
                month: dateArr[1] + 1,
                day: dateArr[2]
            }
        },
        _getDaysOfMonth(dateArr) {
            var currentMonthArr = this._replaceArr_.call(dateArr, 2, 1, 1),
                nextMonthArr = this._replaceArr_.call(currentMonthArr, 1, 1, currentMonthArr[1] + 1),
                days = (this._dateToTime(nextMonthArr) - this._dateToTime(currentMonthArr)) / (24 * 60 * 60 * 1000);
            return days
        },
        _viewData: function(dateArr) {
            var prevDateArr = [],
                currentDateArr = [],
                nextDateArr = [],
                days = this._getDaysOfMonth(dateArr),
                firstDayTime = this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, 1)),
                endDayTime = this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, days)),
                firstDayWeek = new Date(firstDayTime).getUTCDay(),
                endDayWeek = new Date(endDayTime).getUTCDay();
            console.log(firstDayWeek, days, endDayWeek)
                /** 
                 * 设置上个月多余日期
                 */
            var setPrevDateArr = function() {
                    for (var i = firstDayWeek - 1; i >= 0; i--) {
                        data = (function(index) {
                            return this._data(this._replaceArr_.call(dateArr, 1, 2, dateArr[1] - 1, index))
                        }).call(this, this._getDaysOfMonth(this._replaceArr_.call(dateArr, 1, 1, dateArr[1] - 1)) - i)
                        prevDateArr.push({ data: data, dateType: 'prev' })
                    }
                }
                /** 
                 * 设置下个月多余日期
                 */
            var setNextDateArr = function() {
                    for (var i = 0; i < 6 - endDayWeek; i++) {
                        data = (function(index) {
                            return this._data(this._replaceArr_.call(dateArr, 1, 2, dateArr[1] + 1, index + 1))
                        }).call(this, i)
                        nextDateArr.push({ data: data, dateType: 'next' })
                    }
                }
                /** 
                 * 设置当前月份日期
                 */
            var setCurrentDateArr = function() {
                for (var i = 0; i < days; i++) {
                    data = (function(index) {
                        return this._data(this._replaceArr_.call(dateArr, 2, 1, index + 1))
                    }).call(this, i)
                    currentDateArr.push({ data: data, dateType: 'current', today: this._dateToTime(this._dateHandle(this._setcurrentDate())) === this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, i + 1)) })
                }
            }

            setPrevDateArr.call(this)
            setNextDateArr.call(this)
            setCurrentDateArr.call(this)
                // console.log(prevDateArr, currentDateArr, nextDateArr)
            return [].concat(prevDateArr, currentDateArr, nextDateArr)



        },
        _view: function(dateArr) {
            var dataArr = this._viewData(dateArr),
                dayRenderFn = this.render || function(dateObj) {
                    return '<span>' + dateObj.day + '</span>'
                },
                htmlGen = function() {
                    var html = '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
                    var tdGen = function(index) {
                        var str = ''
                        for (var i = 0; i < 7; i++) {
                            str += '<td data-date-type="' + dataArr[index * 7 + i].dateType + '" data-date="' + dataArr[index * 7 + i].data.date + '" data-today="' + (dataArr[index * 7 + i].today ? true : false) + '">' + dayRenderFn(dataArr[index * 7 + i].data) + '</td>'
                        }
                        return str
                    }
                    for (var i = 0; i < dataArr.length / 7; i++) {
                        html += '<tr>' +
                            tdGen(i) +
                            '</tr>'
                    }
                    return html
                },
                dateViewNode = document.createElement('table');
            dateViewNode.innerHTML = htmlGen()
            this._el_.querySelectorAll('.date-picker-view-wrap')[0].appendChild(dateViewNode)
            console.log(dateViewNode)
        },
        _next: function() {

        },
        _prev: function() {

        },
        _eventBind: function() {

        },
        _setcurrentDate: function() {
            var nowTime = new Date().getTime()
            return this.currentDate || this._dateFormat(nowTime)
        },
        _dateFormat: function(dateTime) {
            var date = new Date(dateTime),
                year = date.getUTCFullYear(),
                month = date.getUTCMonth(),
                day = date.getUTCDate()
            return this.format
                .replace('yyyy', year)
                .replace('mm', month + 1 > 9 ? month + 1 : '0' + (month + 1))
                .replace('dd', day > 9 ? day : '0' + day)
        },
        _changeView: function() {

        },
        _setInitStyle: function() {
            var elNode = document.querySelectorAll(this.el)[0],
                ifInput = elNode.tagName.toLowerCase() === 'input',
                basicStyle = 'bottom:auto;right:auto;top:' + (elNode.getBoundingClientRect().top + elNode.offsetHeight) + 'px;left:' + elNode.getBoundingClientRect().left + 'px;'
            if (this.el === 'body') return ''
            if (ifInput) return basicStyle + 'width:' +
                elNode.offsetWidth + 'px;'
            return basicStyle
        },
        _generateTemplate: function() {
            switch (showType) {
                case 'years':
                case 'mouths':
                    return ''
            }
        },
        /**
         * 周期
         */
        _beforeInit: function() {
            var _this_ = this,
                elNode = document.querySelectorAll(this.el)[0],
                datePickerWrap =
                '<div class="date-picker-top-handle"><i>&lsaquo;</i><sapn>' +
                this._setcurrentDate() +
                '</sapn><i>&rsaquo;</i></div>' +
                '<div class="date-picker-view-wrap"></div>',
                datePickerWrapNode = document.createElement('div');
            datePickerWrapNode.classList.add('date-picker-wrap', this.customizeClass)
            datePickerWrapNode.setAttribute('style', this._setInitStyle())
            datePickerWrapNode.innerHTML = datePickerWrap
            this._el_ = datePickerWrapNode;
            document.getElementsByTagName('body')[0].appendChild(datePickerWrapNode);
            //绑定事件到挂载点,若无挂载点则需调用show方法打开控件
            if (this.el !== 'body') {
                elNode.addEventListener('click', function() {
                    _this_.show()
                })
            }


        },
        _init() {
            this._view(this._dateHandle(this._setcurrentDate()))
        },
        _inited: function() {

        },
        _beforeDestroy: function() {

        },
        _destroyed: function() {

        },
        /** 
         * 实例方法
         */
        show: function() {

        },
        hide: function() {

        },
        remove: function() {

        },
        next: function() {

        },
        prev: function() {

        }





    }


















    return {
        DatePicker: DatePicker
    };
}));



new window.componentLibrary.DatePicker({
    el: '#app',
    customizeClass: 'my-date-picker'


})
new window.componentLibrary.DatePicker({
    el: '#btn',
    customizeClass: 'my-date-picker'


})
new window.componentLibrary.DatePicker({
    customizeClass: 'my-date-picker'


})