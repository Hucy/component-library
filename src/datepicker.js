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
        this._currentShowType = this.type
        this.customizeClass = this.option.customizeClass || ''
        this.currentDate = this.option.currentDate || ''
        this.maxDate = this.option.maxDate || ''
        this.minDate = this.option.minDate || ''
        this.render = this.option.render || ''
        this.data = this.option.data || []
        this.beforeInit = this.option.beforeInit || ''
        this.inited = this.option.inited || ''
        this.beforeDestroy = this.option.beforeDestroy || ''
        this.destroyed = this.option.destroyed || ''
        this.nextCb = this.option.nextCb || ''
        this.prevCb = this.option.prevCb || ''
        this.nodeClickCb = this.option.nodeClickCb || ''
        this.nodeEvent = this.option.nodeEvent || ''
        this.format = this.option.format || (function() {
            if (this.type === 'days') return 'yyyy-mm-dd'
            if (this.type === 'months') return 'yyyy-mm'
            return 'yyyy'
        }).call(this)
        this._startUp()
    }

    DatePicker.prototype = {
        constructor: DatePicker,
        _startUp: function() {
            this._beforeInit()
            this.show()
            this._inited()
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
            var orderObj = {}
            var formatArr = (function() {
                switch (this.type) {
                    case 'years':
                        orderObj = {
                            yyyy: this.format.indexOf('yyyy')
                        }
                        return [dateString.substr(orderObj.yyyy, 4) - 0, 0, 1]

                    case 'months':
                        orderObj = {
                            yyyy: this.format.indexOf('yyyy'),
                            mm: this.format.indexOf('mm')
                        }
                        return [dateString.substr(orderObj.yyyy, 4) - 0, dateString.substr(orderObj.mm, 2) - 1, 1]

                    case 'days':
                        orderObj = {
                            yyyy: this.format.indexOf('yyyy'),
                            mm: this.format.indexOf('mm'),
                            dd: this.format.indexOf('dd')
                        }

                        return this._realDateArr([dateString.substr(orderObj.yyyy, 4) - 0, dateString.substr(orderObj.mm, 2) - 1, dateString.substr(orderObj.dd, 2) - 0])

                }
            }).call(this)
            return formatArr
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
        _getDaysOfMonth: function(dateArr) {
            var currentMonthArr = this._replaceArr_.call(dateArr, 2, 1, 1),
                nextMonthArr = this._replaceArr_.call(currentMonthArr, 1, 1, currentMonthArr[1] + 1),
                days = (this._dateToTime(nextMonthArr) - this._dateToTime(currentMonthArr)) / (24 * 60 * 60 * 1000);
            return days
        },
        _ifAllowDateRange: function(dateArr, ifData) {
            var setRangeDateArr = function(date) {
                    if (date) {
                        if (date.getcurrentDate) return date.getcurrentDate
                        return this._dateHandle(date)
                    } else {
                        return dateArr
                    }
                },
                ifAllow = function(min, current, max) {
                    var minTime = this._dateToTime(min),
                        maxTime = this._dateToTime(max),
                        currentTime = this._dateToTime(current);
                    if (ifData) {
                        return [minTime <= currentTime && maxTime >= currentTime, min, current, max]
                    } else {
                        return minTime <= currentTime && maxTime >= currentTime
                    }

                },
                minDateArr = setRangeDateArr.call(this, this.minDate),
                maxDateArr = setRangeDateArr.call(this, this.maxDate);
            if (this._currentShowType === this.type) {
                return ifAllow.call(this, minDateArr, dateArr, maxDateArr)
            } else {
                switch (this._currentShowType) {
                    case 'months':
                        return ifAllow.call(this, [minDateArr[0], minDateArr[1], 1], [dateArr[0], dateArr[1], 1], [maxDateArr[0], maxDateArr[1], 1])
                    case 'years':
                        return ifAllow.call(this, [minDateArr[0], 0, 1], [dateArr[0], 0, 1], [maxDateArr[0], 0, 1])
                }
            }

        },
        _viewData: function(dateArr) {
            // console.log(dateArr)
            var dataArr = [],
                _this = this
            var daysDataGen = function() {
                var prevDateArr = [],
                    currentDateArr = [],
                    nextDateArr = [],
                    days = this._getDaysOfMonth(dateArr),
                    firstDayTime = this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, 1)),
                    endDayTime = this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, days)),
                    firstDayWeek = new Date(firstDayTime).getUTCDay(),
                    endDayWeek = new Date(endDayTime).getUTCDay();
                // console.log(firstDayWeek, days, endDayWeek)
                /** 
                 * 设置上个月多余日期
                 */
                var setPrevDateArr = function() {
                        for (var i = firstDayWeek - 1; i >= 0; i--) {
                            var data = (function(index) {
                                return this._data(this._replaceArr_.call(dateArr, 1, 2, dateArr[1] - 1, index))
                            }).call(this, this._getDaysOfMonth(this._replaceArr_.call(dateArr, 1, 1, dateArr[1] - 1)) - i)
                            prevDateArr.push({ data: data, dateType: 'prev', ifAllow: this._ifAllowDateRange([dateArr[0], dateArr[1] - 1, this._getDaysOfMonth([dateArr[0], dateArr[1] - 1, 1]) - i]) })
                        }
                    }
                    /** 
                     * 设置下个月多余日期
                     */
                var setNextDateArr = function() {
                        for (var i = 0; i < 6 - endDayWeek; i++) {
                            var data = (function(index) {
                                return this._data(this._replaceArr_.call(dateArr, 1, 2, dateArr[1] + 1, index + 1))
                            }).call(this, i)
                            nextDateArr.push({ data: data, dateType: 'next', ifAllow: this._ifAllowDateRange([dateArr[0], dateArr[1] + 1, i + 1]) })
                        }
                    }
                    /** 
                     * 设置当前月份日期
                     */
                var setCurrentDateArr = function() {
                    for (var i = 0; i < days; i++) {
                        var data = (function(index) {
                            return this._data(this._replaceArr_.call(dateArr, 2, 1, index + 1))
                        }).call(this, i)
                        currentDateArr.push({ data: data, dateType: 'current', today: this._dateToTime(this._dateHandle(this._setcurrentDate())) === this._dateToTime(this._replaceArr_.call(dateArr, 2, 1, i + 1)), ifAllow: this._ifAllowDateRange([dateArr[0], dateArr[1], i + 1]) })
                    }
                }

                setPrevDateArr.call(this)
                setNextDateArr.call(this)
                setCurrentDateArr.call(this)
                    // console.log(prevDateArr, currentDateArr, nextDateArr)
                return [].concat(prevDateArr, currentDateArr, nextDateArr)
            }
            var monthDataGen = function() {
                var monthsArr = [];
                for (var i = 0; i < 12; i++) {
                    var data = (function(index) {
                        return this._data(this._realDateArr(this._replaceArr_.call(dateArr, 1, 1, index)))
                    }).call(this, i)
                    monthsArr.push({
                        data: data,
                        today: this._dateToTime(this._dateHandle(this._setcurrentDate())) === this._dateToTime(this._replaceArr_.call(dateArr, 1, 1, i)),
                        ifAllow: this._ifAllowDateRange([dateArr[0], i, dateArr[2]])
                    })
                }
                return monthsArr
            }
            var yearDateGen = function() {
                    var yearArr = [],
                        yearDataArr = [];
                    for (var i = 5; i > 0; i--) {
                        yearArr.push(dateArr[0] - i)
                    }
                    for (var i = 0; i < 7; i++) {
                        yearArr.push(dateArr[0] + i)
                    }
                    for (var i = 0; i < yearArr.length; i++) {
                        var data = (function(index) {
                            return this._data(this._replaceArr_.call(dateArr, 0, 1, yearArr[index]))
                        }).call(this, i)
                        yearDataArr.push({
                            data: data,
                            today: this._dateToTime(this._dateHandle(this._setcurrentDate())) === this._dateToTime(this._replaceArr_.call(dateArr, 0, 1, yearArr[i])),
                            ifAllow: this._ifAllowDateRange([yearArr[i], dateArr[1], dateArr[2]])
                        })
                    }
                    return yearDataArr
                }
                // this._currentShowType = 'months'

            switch (this._currentShowType) {
                case 'days':
                    dataArr = daysDataGen.call(this);
                    break;
                case 'months':
                    dataArr = monthDataGen.call(this);
                    break;
                case 'years':
                    dataArr = yearDateGen.call(this);
                    break;
            }
            return { showType: this._currentShowType, dataArr: dataArr }
        },
        _view: function(dateArr) {
            // console.log(this._viewData(dateArr))
            var dataObj = this._viewData(dateArr),
                dataArr = dataObj.dataArr,
                customizeData = this.data,
                dayRenderFn = this.render || function(dateObj) {
                    return '<span>' + dateObj.day + '</span>'
                },
                htmlGen = function() {
                    var daysHtml = function() {
                        var html = '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
                        var tdGen = function(index) {
                            var str = ''
                            for (var i = 0; i < 7; i++) {
                                str += '<td  class="days-node"  data-date-type="' + dataArr[index * 7 + i].dateType + '" data-date="' + dataArr[index * 7 + i].data.date + '" data-today="' + (dataArr[index * 7 + i].today ? true : false) + '"  data-allow="' + (dataArr[index * 7 + i].ifAllow ? true : false) + '">' + dayRenderFn(dataArr[index * 7 + i].data, customizeData[index * 7 + i]) + '</td>'
                            }
                            return str
                        }
                        for (var i = 0; i < dataArr.length / 7; i++) {
                            html += '<tr>' +
                                tdGen(i) +
                                '</tr>'
                        }
                        return html
                    }
                    var monthsHtml = function() {
                        var html = '';
                        var tdGen = function(index) {
                            var str = ''
                            for (var i = 0; i < 4; i++) {
                                str += '<td class="months-node" data-date="' + dataArr[index * 4 + i].data.date + '" data-today="' + (dataArr[index * 4 + i].today ? true : false) + '" data-allow="' + (dataArr[index * 4 + i].ifAllow ? true : false) + '">' +
                                    '<span>' + dataArr[index * 4 + i].data.month + '</span>' +
                                    '</td>'
                            }
                            return str
                        }
                        for (var i = 0; i < dataArr.length / 4; i++) {
                            html += '<tr>' +
                                tdGen(i) +
                                '</tr>'
                        }
                        return html
                    }
                    var yearsHTML = function() {
                        var html = '';
                        var tdGen = function(index) {
                            var str = ''
                            for (var i = 0; i < 4; i++) {
                                str += '<td class="years-node" data-date="' + dataArr[index * 4 + i].data.date + '" data-today="' + (dataArr[index * 4 + i].today ? true : false) + '" data-allow="' + (dataArr[index * 4 + i].ifAllow ? true : false) + '">' +
                                    '<span>' + dataArr[index * 4 + i].data.year + '</span>' +
                                    '</td>'
                            }
                            return str
                        }
                        for (var i = 0; i < dataArr.length / 4; i++) {
                            html += '<tr>' +
                                tdGen(i) +
                                '</tr>'
                        }
                        return html

                    }
                    switch (dataObj.showType) {
                        case 'days':
                            return daysHtml()
                            break;
                        case 'months':
                            return monthsHtml()
                            break;
                        case 'years':
                            return yearsHTML()
                            break;
                    }
                };

            return htmlGen()


        },
        _realDateArr: function(dateArr) {
            if (dateArr[2] <= this._getDaysOfMonth([dateArr[0], dateArr[1], 1])) {
                return dateArr
            }
            return [dateArr[0], dateArr[1], this._getDaysOfMonth([dateArr[0], dateArr[1], 1])]
        },
        _next: function() {
            var nextObj = {
                days: [1, 1],
                months: [0, 1],
                years: [0, 5]
            }
            var currentDateArr = this._dateHandle(this._setcurrentDate()),
                nextDateArr = this._replaceArr_.call(currentDateArr, nextObj[this._currentShowType][0], 1, currentDateArr[nextObj[this._currentShowType][0]] + nextObj[this._currentShowType][1])
                // this._setcurrentDate(nextDateArr)
            this._init(this._realDateArr(nextDateArr))
            this._currentShowType === this.type && this.nextCb && this.nextCb(this)
        },
        _prev: function() {
            var prevObj = {
                days: [1, 1],
                months: [0, 1],
                years: [0, 5]
            }
            var currentDateArr = this._dateHandle(this._setcurrentDate()),
                prevDateArr = this._replaceArr_.call(currentDateArr, prevObj[this._currentShowType][0], 1, currentDateArr[prevObj[this._currentShowType][0]] - prevObj[this._currentShowType][1]);
            // this._setcurrentDate(prevDateArr)
            this._init(this._realDateArr(prevDateArr));
            this._currentShowType === this.type && this.prevCb && this.prevCb(this)
        },
        _dateNode: function(dateNode) {
            // console.log(dateNode.dataset.allow === 'true')
            if (dateNode.dataset.allow === 'true') {
                var ifFinally = this._changeView('down', dateNode.dataset.date)
                ifFinally && (function() {
                    var clickDateArr = this._dateHandle(dateNode.dataset.date)
                        // this._setcurrentDate(clickDateArr)
                    this._init(clickDateArr)
                    this.nodeClickCb && this.nodeClickCb(dateNode, this)
                        // this.hide()
                }).call(this)
            }

        },
        _eventBind: function() {
            var _this = this;
            //搜索最近的父元素或自身
            function closest(el, selector, stopSelector) {
                var retval = null;
                while (el) {
                    if (el.matches(selector)) {
                        retval = el;
                        break
                    } else if (stopSelector && el.matches(stopSelector)) {
                        break
                    }
                    el = el.parentElement;
                }
                return retval;
            }
            _this._el_.addEventListener('click', function(e) {
                // console.log(e)
                var eventTarget = e.target;
                var dateNode = closest(eventTarget, 'td', '.date-picker-view-wrap');
                /** 
                 * 日期节点
                 */
                if (dateNode) {

                    _this._dateNode(dateNode)

                }
                /** 
                 * 上个日期
                 * 下个日期
                 * 更改显示周期
                 */
                if (eventTarget && eventTarget.classList.contains('prev-btn')) {
                    _this._prev()

                }
                if (eventTarget && eventTarget.classList.contains('next-btn')) {
                    _this._next()

                }

                if (eventTarget && eventTarget.classList.contains('current-date')) {
                    _this._changeView('up')
                }

                e.stopPropagation()
            }, false)
            if (this.nodeEvent) {
                for (var event in this.nodeEvent) {
                    _this._el_.addEventListener(event, function(e) {
                        var eventTarget = e.target;
                        var dateNode = closest(eventTarget, 'td', '.date-picker-view-wrap');
                        if (dateNode && _this.type === _this._currentShowType) {

                            _this.nodeEvent[event](dateNode, e, this)

                        }
                    })
                }
            }
        },
        _setcurrentDate: function(dateArr) {
            var nowTime = new Date().getTime()
            this.currentDate = this.currentDate || this._dateFormat(nowTime)
            this.currentDate = dateArr ? this._dateFormat(this._dateToTime(dateArr)) : this.currentDate;
            dateArr && (this._el_.querySelectorAll('.current-date')[0].innerHTML = this.currentDate)
            this._ifInput() && (document.querySelectorAll(this.el)[0].value = this.currentDate)
            return this.currentDate
        },
        getcurrentDate: function() {
            return this._dateHandle(this._setcurrentDate())
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
        _changeView: function(handleType, dateString) {
            var switchObj = {
                days: 2,
                months: 1,
                years: 0,
                2: 'days',
                1: 'months',
                0: 'years'
            }
            var dateArr = dateString ? this._dateHandle(dateString) : []
            var upView = function() {
                if (switchObj[this._currentShowType] === 0) {
                    return true
                }
                var updateCurrentShowtype = switchObj[switchObj[this._currentShowType] - 1];
                this._currentShowType = updateCurrentShowtype;
                var currentDateArr = this._dateHandle(this._setcurrentDate())
                this._init(currentDateArr)
            }
            var downView = function(data) {
                if (switchObj[this._currentShowType] - switchObj[this.type] === 0) {
                    return true
                }
                var updateCurrentShowtype = switchObj[switchObj[this._currentShowType] + 1];
                var currentDateArr = this._dateHandle(this._setcurrentDate()),
                    downDateArr = this._replaceArr_.call(currentDateArr, switchObj[this._currentShowType], 1, data);
                this._currentShowType = updateCurrentShowtype;
                this._init(this._realDateArr(downDateArr))

            }

            return handleType === 'up' ? upView.call(this) : downView.call(this, dateArr[switchObj[this._currentShowType]])
        },
        _ifInput: function() {
            var elNode = document.querySelectorAll(this.el)[0],
                ifInput = elNode.tagName.toLowerCase() === 'input'
            return ifInput
        },
        _setInitStyle: function() {
            var elNode = document.querySelectorAll(this.el)[0],
                basicStyle = 'bottom:auto;right:auto;top:' + (elNode.getBoundingClientRect().top + elNode.offsetHeight) + 'px;left:' + elNode.getBoundingClientRect().left + 'px;'
            if (this.el === 'body') return ''
            if (this._ifInput()) return basicStyle + 'width:' +
                elNode.offsetWidth + 'px;'
            return basicStyle
        },
        /**
         * 周期
         */
        _beforeInit: function() {

            var _this_ = this,
                elNode = document.querySelectorAll(this.el)[0],
                datePickerWrap =
                '<div class="date-picker-top-handle"><i class="prev-btn">&lsaquo;</i><sapn class="current-date">' +
                this._setcurrentDate() +
                '</sapn><i class="next-btn">&rsaquo;</i></div>' +
                '<div class="date-picker-view-wrap"></div>';
            this.beforeInit && this.beforeInit(this)
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
        _init: function(dateArr) {
            var dateArr = dateArr
            var ifAllowData = this._ifAllowDateRange(dateArr, true)
            if (ifAllowData[0] === false) {
                if (this._dateToTime(ifAllowData[1]) > this._dateToTime(ifAllowData[2])) {
                    dateArr = ifAllowData[1]
                } else {
                    dateArr = ifAllowData[3]
                }
            }
            var dateViewNode = document.createElement('table'),
                viewWrap = this._el_.querySelectorAll('.date-picker-view-wrap')[0],
                tableNode = viewWrap.querySelectorAll('table')[0];
            this._setcurrentDate(dateArr)
            dateViewNode.innerHTML = this._view(dateArr)
                // console.log(tableNode)
            if (!tableNode) { viewWrap.appendChild(dateViewNode) } else {
                viewWrap.replaceChild(dateViewNode, tableNode)
            }

        },
        _inited: function() {
            this._eventBind()
            this.inited && this.inited(this._el_, this)
        },
        _beforeDestroy: function() {
            this.beforeDestroy && this.beforeDestroy(this)
        },
        _destroyed: function() {
            var _this = this,
                elNode = document.querySelectorAll(this.el)[0];
            if (this.el !== 'body') {
                elNode.removeEventListener('click', function() {
                    _this_.show()
                })
            }
            document.getElementsByTagName('body')[0].removeChild(this._el_);
            this.destroyed && this.destroyed(this)
        },
        /** 
         * 实例方法
         */
        show: function() {
            this._init(this._dateHandle(this._setcurrentDate()))
            this._el_.style.display = 'block'
        },
        hide: function() {
            this._el_.style.display = 'none';
        },
        remove: function() {
            this._beforeDestroy()
            this._destroyed()
        },
        next: function() {
            this._next()
        },
        prev: function() {
            this._prev()
        }
    }
    return {
        DatePicker: DatePicker
    };
}));