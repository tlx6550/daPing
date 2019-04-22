/*var baseUrl = 'https://easy-mock.com/mock/5bfd0066e14e0125f051fe18/dapi'*/
var cityCp = {
	"黑龙江": [
		126.63,
		45.74
	],
	"吉林": [
		126.591279,
		43.872687
	],
	"新疆": [
		87.36,
		43.46
	],
	"辽宁": [
		123.23,
		41.48
	],
	"内蒙古": [
		111.38,
		40.48
	],
	"北京": [
		116.28,
		39.54
	],
	"天津": [
		117.1,
		39.1
	],
	"宁夏": [
		106.13,
		38.28
	],
	"河北": [
		114.26,
		38.03
	],
	"山西": [
		112.33,
		37.51
	],
	"山东": [
		117.02,
		36.4
	],
	"青海": [
		101.49,
		36.37
	],
	"甘肃": [
		103.5,
		36.03
	],
	"河南": [
		113.42,
		34.44
	],
	"陕西": [
		108.55,
		34.15
	],
	"安徽": [
		117.16,
		31.51
	],
	"上海": [
		121.26,
		31.12
	],
	"湖北": [
		114.2,
		30.37
	],
	"江苏": [
		119.46,
		32.03
	],
	"四川": [
		104.04,
		30.39
	],
	"浙江": [
		120.210336,
		30.264562
	],
	"西藏": [
		91.02,
		29.39
	],
	"重庆": [
		106.33,
		29.33
	],
	"江西": [
		115.53,
		28.41
	],
	"湖南": [
		112.55,
		28.12
	],
	"贵州": [
		106.43,
		26.34
	],
	"福建": [
		119.19,
		26.02
	],
	"云南": [
		102.42,
		25.03
	],
	"广东": [
		113.18,
		23.1
	],
	"广西": [
		108.21,
		22.47
	],
	"海南": [
		110.1,
		20.03
	]
}
var baseUrl = 'http://10.9.12.73:8080/v'
var PIERAND = 1000;
//var imgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543496484870&di=040d5a1b26b462b6fd57297a4dc3433d&imgtype=0&src=http%3A%2F%2Fs13.sinaimg.cn%2Fmw690%2F004lDxWVzy77sFS6jcodc%26690'
//var baseUrl = window.location.protocol + '//' + window.location.host + '/v';
var that = new Vue({
	el: '#app',
	data: {
		SIZE: 0,
		barCharStyle: {},
		downloadProvinceTop: '',
		downloadUserTop: '',
		downloadTrafficTop: '',
		topT12: '',
		other12: '',
		appTop18: '',
		gameTop18: '',
		cityData: '',
		showR1: false,
		leftChartFlag: true,
		r1Temp: 0,
		nowDate: '',
		nowTime: '',
		toTalValueFen: '', //分省总量
		downLoadTotal: '', //下载总量
		commonOption: {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '5%',
				right: '0%',
				top: '8%',
				bottom: 0,
				containLabel: true
			},
			xAxis: {
				show: false, //隐藏y轴坐标线
				type: 'value',
				boundaryGap: [0, 0.01],
			},
		},
		myChartFen: '',
		myChartUser: '',
		myChartLiu: '',
		myChartFen2: '',
		myChartUser2: '',
		myChartLiu2: '',
		mapChart: '',
		showTooltipGloble: true,
		faultByHourIndex: 0,
		xinChart: '',
		xinData: ''
	},
	methods: {
		getTop12() {
			axios.post(baseUrl + '/screenData/top10?key=downloadApp')
				.then(function(response) {
					var resData = response.data.data
					if(resData != null || resData != undefined || resData != '') {
						var temp = []
						resData.forEach(function(item) {
							var changeUrl = encodeURIComponent(item.icon);
							var obj = {
								"icon": baseUrl + '/screenData/img?url=' + changeUrl,
								//"icon":imgUrl,
								"name": item.name,
								"value": item.value
							}
							if(!(obj.name == '必备应用' || obj.name == 'MM应用商场')) {
								temp.push(obj)
							}

						})

						that.appTop18 = temp
						//json排序
						that.appTop18.sort(function(x, y) {
							return y.value - x.value;
						})
					}

				})
				.catch(function(error) {
					console.log(error);
				});
		},
		getTopOther12() {
			axios.post(baseUrl + '/screenData/top10?key=downloadGame')
				.then(function(response) {
					var resData = response.data.data
					if(resData != null || resData != undefined || resData != '') {
						var temp = []
						resData.forEach(function(item) {
							var changeUrl = encodeURIComponent(item.icon);
							var obj = {
								"icon": baseUrl + '/screenData/img?url=' + changeUrl,
								//"icon":imgUrl,
								"name": item.name,
								"value": item.value
							}
							temp.push(obj)
						})

						that.gameTop18 = temp
						//json排序
						that.gameTop18.sort(function(x, y) {
							return y.value - x.value;
						})
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		showOrHide() { //切屏时间
			setInterval(function() {
				that.r1Temp++;
				var tag = that.r1Temp % 2 == 0 ? true : false
				if(!tag) {
					that.showR1 = true
					that.leftChartFlag = true
				} else {
					that.showR1 = false
					that.leftChartFlag = false
				}
			}, 12 * 1000)
		},
		initChart() {
			// 基于准备好的dom，初始化echarts实例
			this.myChartFen = echarts.init(this.$refs.fenshengDown);
			this.myChartUser = echarts.init(this.$refs.downUser);
			this.myChartLiu = echarts.init(this.$refs.downLiuliang);

			this.myChartFen2 = echarts.init(this.$refs.fenshengDown2);
			this.myChartUser2 = echarts.init(this.$refs.downUser2);
			this.myChartLiu2 = echarts.init(this.$refs.downLiuliang2);

			//柱状图实际数据
			var valOption1 = {
				color: '#357DFF',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData6F
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 500000
				},
				series: [{
					type: 'bar',
					data: this.seriesData6F

				}, ]
			}
			var valOption2 = {
				color: '#FFA95C',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData6U
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 70000
				},
				series: [{
					type: 'bar',
					data: this.seriesData6U,

				}, ]
			}
			var valOption3 = {
				color: '#81D7FF',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							fontSize: 0.16 * this.SIZE + 'px',
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData6L
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 42000
				},
				series: [{
					type: 'bar',
					data: this.seriesData6L,
				}, ]
			}

			var valOption11 = {
				color: '#357DFF',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData12F
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 500000
				},
				series: [{
					type: 'bar',
					data: this.seriesData12F

				}, ]
			}
			var valOption21 = {
				color: '#FFA95C',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData12U
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 70000
				},
				series: [{
					type: 'bar',
					data: this.seriesData12U,

				}, ]
			}
			var valOption31 = {
				color: '#81D7FF',
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							fontSize: 0.16 * this.SIZE + 'px',
							color: '#D9EBFF' //y轴颜色
						}
					},
					type: 'category',
					// y 轴线
					axisTick: {
						show: false
					},
					data: this.yAxisData12L
				},
				xAxis: {
					show: false, //隐藏y轴坐标线
					type: 'value',
					boundaryGap: [0, 0.01],
					min: 0,
					max: 42000
				},
				series: [{
					type: 'bar',
					data: this.seriesData12L,

				}, ]
			}
			/*====================================*/
			var initOptions1 = Object.assign({}, this.commonOption, valOption1)
			var initOptions2 = Object.assign({}, this.commonOption, valOption2)
			var initOptions3 = Object.assign({}, this.commonOption, valOption3)

			var initOptions11 = Object.assign({}, this.commonOption, valOption11)
			var initOptions21 = Object.assign({}, this.commonOption, valOption21)
			var initOptions31 = Object.assign({}, this.commonOption, valOption31)

			this.myChartFen.setOption(initOptions1);
			this.myChartUser.setOption(initOptions2);
			this.myChartLiu.setOption(initOptions3);

			this.myChartFen2.setOption(initOptions11);
			this.myChartUser2.setOption(initOptions21);
			this.myChartLiu2.setOption(initOptions31);
		},
		initXinChart() {
			this.xinChart = echarts.init(this.$refs.xintiaoMap);
		},
		setDataXinChart() {
			var that = this
			var xinOption = {
				/*				tooltip: {
									trigger: 'axis',
									formatter: function(params) {
										params = params[0];
										var date = new Date(params.name);
										return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
									},
									axisPointer: {
										animation: false
									}
								},*/
/*				grid: {
					left: 'auto',
					height: 'auto',
					x: 80,
					y: 60,
					x2: 20,
					y2:20
				},*/
				xAxis: {
					type: 'category',
					splitLine: {
						show: false
					},
					axisLabel: {
						show: true,
						textStyle: {
							color: '#75DEFF'
						}
					},
					axisLine: {
						lineStyle: {
							color: '#75DEFF',
							width: 1, //这里是为了突出显示加上的
						}
					}

				},
				yAxis: {
					type: 'value',
					boundaryGap: [0, '100%'],
					splitLine: {
						show: false
					},
					axisLabel: {
						formatter: '{value}',
						textStyle: {
							color: '#75DEFF'
						}
					},
					axisLine: {
						lineStyle: {
							color: '#75DEFF',
							width: 1, //这里是为了突出显示加上的
						}
					}
				},
				series: [{
					name: '30分钟下载量趋势',
					type: 'line',
					color: '#74DDFF',
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(137, 189, 27, 1, [{
								offset: 0,
								color: 'rgba(137, 189, 27, 0.3)'
							}, {
								offset: 0.8,
								color: 'rgba(40,82,97,1)'
							}], false),
							shadowBlur: 10
						}
					},
					showSymbol: false,
					hoverAnimation: false,
					data: that.xinData,
					smooth: true
				}]
			}

			that.xinChart.setOption(xinOption);
			/*			setInterval(function() {

							for(var i = 0; i < 5; i++) {
								xinData.shift();
								xinData.push(randomData());
							}

							that.xinChart.setOption(xinOption);
						}, 3000);*/

		},
		getDownloadPeriod() {
			var that = this
			// --心跳数据
			return axios.post(baseUrl + '/screenData/top10?key=downloadPeriod&sort=0')
				.then(function(res) {
					var resData = res.data.data
					if(resData != null || resData != undefined || resData != '') {
						var sortData = resData.sort(function(x,y){
							return parseInt(x.name) - parseInt(y.name)
						})

						resData = sortData.map(function(item) {
							var timeObj = that.formaTime(item.name)
							var time = timeObj.H + ':' + timeObj.M + ':' + timeObj.S
							var value = item.value
							var obj = {
								'name': new Date(parseInt(item.name)).toString(),
								'value': [
									time,
									parseInt(item.value)
								]
							}
							return obj

						})
						that.xinData = resData
						that.setDataXinChart()
						that.setIntervalDownloadPeriod()
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		//柱状图数据
		getDownloadTraffic() {
			var that = this
			// --流量
			return axios.post(baseUrl + '/screenData/top10?key=downloadTraffic&num=12')
				.then(function(res) {
					var resData = res.data.data
					if(resData != null || resData != undefined || resData != '') {
						//图例数据转换
						resData = resData.map(function(item) {
							return {
								name: item.name,
								value: Math.ceil(item.value / 1024 / 1024)
							}
						})
						var dataObj = that.exchanDataTobar(resData)
						//绘图数据的顺序和排序刚好相反，前端展示的和实际顺序一样
						//slice实现数组拷贝
						that.downloadTrafficTop = dataObj.topData.slice(0).reverse()
						that.yAxisData6L = dataObj.yAxisData.slice(6, 12)
						that.seriesData6L = dataObj.seriesData.slice(6, 12)
						that.yAxisData12L = dataObj.yAxisData.slice(0, 6)
						that.seriesData12L = dataObj.seriesData.slice(0, 6)
						//that.initChart()
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		getDownloadProvince() {
			var that = this
			//分省下载量
			return axios.post(baseUrl + '/screenData/top10?key=downloadProvince')
				.then(function(res) {
					var resData = res.data.data
					if(resData != null || resData != undefined || resData != '') {
						//展示数据比例转换
						var sum = 0;
						resData.forEach(function(item) {
							sum += item.value
						})
						that.toTalValueFen = sum
						resData = resData.map(function(item) {
							return {
								name: item.name,
								value: Math.ceil(item.value / sum * that.downLoadTotal)
							}
						})
						//地图数据也是一样
						that.getCityData(resData)
						var dataObj = that.exchanDataTobar(resData)
						//绘图数据的顺序和排序刚好相反，前端展示的和实际顺序一样
						//slice实现数组拷贝
						that.downloadProvinceTop = dataObj.topData.slice(0).reverse()
						var len = dataObj.seriesData.length
						that.yAxisData6F = dataObj.yAxisData.slice(len - 6, len)
						that.seriesData6F = dataObj.seriesData.slice(len - 6, len)
						that.yAxisData12F = dataObj.yAxisData.slice(len - 12, len - 6)
						that.seriesData12F = dataObj.seriesData.slice(len - 12, len - 6)
						//that.initChart()
					}

				})
				.catch(function(error) {
					console.log(error);

				});
		},
		getDwnloadProvince() {
			var that = this
			//用户
			return axios.post(baseUrl + '/screenData/top10?key=downloadUser&num=12')
				.then(function(res) {
					var resData = res.data.data
					if(resData != null || resData != undefined || resData != '') {
						//图例数据转换
						resData = resData.map(function(item) {
							return {
								name: item.name,
								value: item.value * 6
							}
						})

						var dataObj = that.exchanDataTobar(resData)
						//绘图数据的顺序和排序刚好相反，前端展示的和实际顺序一样
						//slice实现数组拷贝
						that.downloadUserTop = dataObj.topData.slice(0).reverse()
						that.yAxisData6U = dataObj.yAxisData.slice(6, 12)
						that.seriesData6U = dataObj.seriesData.slice(6, 12)
						that.yAxisData12U = dataObj.yAxisData.slice(0, 6)
						that.seriesData12U = dataObj.seriesData.slice(0, 6)
						//that.initChart()
					}

				})
				.catch(function(error) {
					console.log(error);
				});
		},
		getScreenDataT10() {
			var that = this
			axios.all([that.getDownloadTraffic(), that.getDownloadProvince(), that.getDwnloadProvince()])
				.then(axios.spread(function(acct, perms) {
					// 柱状图请求现在都执行完成
					that.initChart()
					//地图渲染
					that.setMapChart()
					if(that.showTooltipGloble) {
						that.showMapTootip()
					}
					that.showTooltipGloble = false
				}));

		},
		//柱状图构造返回数据格式
		exchanDataTobar(arrData) {
			//chart数据
			var temp = arrData.sort(function(x, y) {
				return x.value - y.value;
			})

			var topData = [];
			var j = temp.length;
			for(var i = 0; i < temp.length; i++) {
				var rank = j--;
				var obj = {
					name: rank + '  ' + temp[i].name,
					ranking: rank,
					value: temp[i].value
				}
				topData.push(obj)
			}
			var yAxisData = [],
				seriesData = []
			topData.forEach(function(item) {
				yAxisData.push(item.name)
				seriesData.push(item.value)
			})
			return {
				topData: topData,
				yAxisData: yAxisData,
				seriesData: seriesData
			}
		},
		getCityData(resData) {
			var that = this
			//求平均数
			var arrTemp = []
			resData.forEach(function(item) {
				arrTemp.push(item.value)
			})

			function arrAverageNum(arr) {
				var sum = 0;
				for(var i = 0; i < arr.length; i++) {
					sum += arr[i];
				};
				return ~~(sum / arr.length * 100) / 100;
			}
			PIERAND = arrAverageNum(arrTemp) / 6
			if(resData != null || resData != undefined || resData != '') {
				var temp = resData.map(function(item) {
					return {
						'name': item.name,
						'value': item.value
					}
				})

				that.cityData = temp
				that.geoCoordMap = cityCp
				var mapSeriesData = that.convertData(that.cityData)
				//var showSeriesData = seriesData.slice(0)
				var sortData = that.convertData(that.cityData.sort(function(a, b) {
					return b.value - a.value;
				}).slice(0, 6))
				// 2、map的配置，配置 option，新建一个地理坐标系 geo ，地图类型为中国地图
				that.mapoption = {
					tooltip: {
						padding: 0,
						trigger: 'item',
						formatter: function(params) {
							let html = ''
							html = '<div>' +
								'<div style="dispaly:block;border: 1px solid #fbef1a69;padding:5px;font-size:18px;">' + params.name + ':' + params.value[2] + '</div>' +
								'</div>'
							return html
						},
/*						grid: {
							left: 'auto',
							height: 'auto',
							x: 0,
							y: 0,
							x2: 0,
							y2: 0
						},*/
						position: function(point, params, dom, rect, size) {
							//其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
							var x = point[0]; //
							var y = point[1];
							var viewWidth = size.viewSize[0];
							var viewHeight = size.viewSize[1];
							var boxWidth = size.contentSize[0];
							var boxHeight = size.contentSize[1];
							var posX = 0; //x坐标位置
							var posY = 0; //y坐标位置

							if(x < boxWidth) { //左边放不开
								posX = 5;
							} else { //左边放的下
								posX = x - boxWidth;
							}

							if(y < boxHeight) { //上边放不开
								posY = 5;
							} else { //上边放得下
								posY = y - boxHeight;
							}

							return [posX + boxWidth, posY + boxHeight];

						},

					},
					geo: {
						map: 'china',
						label: {
							emphasis: {
								show: false
							}
						},
						roam: true,
						itemStyle: {
							// 普通状态下的样式
							normal: {
								areaColor: 'transparent',
								borderColor: '#3fdaff',
								borderWidth: 2,
								shadowColor: 'rgba(63, 218, 255, 0.5)',
								shadowBlur: 30
							},
							// 高亮状态下的样式
							emphasis: {
								areaColor: '#2B91B7',
							}
						}
					},
					series: [{
							name: '下载量',
							type: 'scatter',
							coordinateSystem: 'geo',
							data: that.convertData(that.cityData),
							symbolSize: function(val) {
								return val[2] / PIERAND;
							},
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: false
								},
								emphasis: {
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#ddb926'
								}
							}
						},
						{
							name: 'Top 5',
							type: 'effectScatter',
							coordinateSystem: 'geo',
							data: sortData,
							symbolSize: function(val) {
								return val[2] / PIERAND;
							},
							showEffectOn: 'render',
							rippleEffect: {
								brushType: 'stroke'
							},
							hoverAnimation: true,
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#f4e925',
									shadowBlur: 10,
									shadowColor: '#333'
								}
							},
							zlevel: 1
						}
					]
				};

			}

		},
		//（4）将数据和城市坐标对应上
		convertData(data) {

			var res = [];
			for(var i = 0; i < data.length; i++) {

				var geoCoord = this.geoCoordMap[data[i].name];
				if(geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value)
					});
				}
			}
			return res;
		},
		initMapChart() {
			this.mapChart = echarts.init(this.$refs.chinaMap);
			echarts.registerMap('china', window.chinaJson); // 注册地图
		},
		setMapChart() {
			var that = this
			//3、调用 setOption(option) 为图表设置配置项
			that.mapChart.setOption(that.mapoption);

		},
		//动态动态显示tootip
		showMapTootip() {
			// 动态显示tootip
			var faultByHourTime = setInterval(function() { //使得tootip每隔三秒自动显示
				that.mapChart.dispatchAction({
					type: 'showTip', // 根据 tooltip 的配置项显示提示框。
					seriesIndex: 0,
					dataIndex: that.faultByHourIndex
				});
				that.faultByHourIndex++;

				// mapoption.series[0].data.length 是已报名纵坐标数据的长度
				if(that.faultByHourIndex >= that.mapoption.series[0].data.length) {
					that.faultByHourIndex = 0;
					//去掉定时器的方法  
					//window.clearInterval(faultByHourTime)
				}
			}, 10 * 1000);
		},
		setTotalDownNum() {
			var that = this
			return new Promise(function(resolve, reject) {
				axios.post(baseUrl + '/screenData/total')
					.then(function(res) {
						var resData = res.data.data
						if(resData != null || resData != undefined || resData != '') {
							var total = res.data.data.downloadTotal
							that.downLoadTotal = total
							/*$('.odometer').html(total)*/
							//$('.down-app-total').empty()
							$('.down-app-total').rollNum({
								deVal: total
							});
							resolve(total);
						}
					})
					.catch(function(error) {
						reject(error);
					});
			})

		},
		setDate() {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			this.nowDate = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
		},
		setTime(nowDate) {
			var time = '';
			time = new Date();
			var hour = time.getHours();
			var minutes = time.getMinutes();
			var seconds = time.getSeconds();
			if(hour < 10) {
				hour = "0" + hour;
			}
			if(minutes < 10) {
				minutes = "0" + minutes;
			}
			if(seconds < 10) {
				seconds = "0" + seconds;
			}
			this.nowTime = hour + ":" + minutes + ":" + seconds;
		},
		formaTime(nowDate) {
			var date = '',
				time = '';
			if(nowDate == '' || nowDate == undefined || nowDate == null) {
				time = new Date();
			} else {
				time = new Date(parseInt(nowDate))
			}
			var hour = time.getHours();
			var minutes = time.getMinutes();
			var seconds = time.getSeconds();
			if(hour < 10) {
				hour = "0" + hour;
			}
			if(minutes < 10) {
				minutes = "0" + minutes;
			}
			if(seconds < 10) {
				seconds = "0" + seconds;
			}
			return {
				'H': hour,
				'M': minutes,
				'S': seconds
			}
		},
		setIntervalDownloadPeriod() {
			setInterval(() => {
				// --心跳数据
				return axios.post(baseUrl + '/screenData/top10?key=downloadCurrent')
					.then(function(res) {
						var resData = res.data.data
						if(resData != null || resData != undefined || resData != '') {
							resData = resData.map(function(item) {
								var timeObj = that.formaTime(item.name)
								var time = timeObj.H + ':' + timeObj.M + ':' + timeObj.S
								var value = item.value
								var obj = {
									'name': new Date(parseInt(item.name)).toString(),
									'value': [
										time,
										parseInt(item.value)
									]
								}
								return obj

							})
							var temp = that.xinData.slice()
							temp.shift();
							temp = temp.concat(resData);
							that.xinData = temp
							that.setDataXinChart()
						}
					})
					.catch(function(error) {
						console.log(error);
					});

				this.setDataXinChart()

			}, 5 * 1000)
		}

	},
	watch: {},
	created: function() {
		//获取地图数据

		(function(win, designW) {
			var doc = win.document;
			var docEle = doc.documentElement;
			designW = designW || 1920; //设计稿宽度px,默认640px设计稿
			var ratio = designW / 100; //640px=> 1rem = 100px, 超出640px font-size：100px;
			var or = "orientationchange" in win ? "orientationchange" : "resize";
			//创建viewport	
			_createViewport();
			_refreshRem()
			/*if(doc.addEventListener){
				win.addEventListener(or, _refreshRem, false);
				doc.addEventListener("DOMContentLoaded", _refreshRem, false);
			}*/
			/**
			 * 创建viewport
			 */
			function _createViewport() {
				var metaEl = doc.createElement('meta');
				metaEl.setAttribute('name', 'viewport');
				metaEl.setAttribute('content', 'initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');
				if(docEle.firstElementChild) {
					docEle.firstElementChild.appendChild(metaEl);
				}
			}
			/**
			 * 动态更新rem
			 */
			function _refreshRem() {
				var clientW = docEle.clientWidth || 320;
				//设置最大和最小宽度取值
				if(clientW > designW) {
					clientW = designW
				} else if(clientW < 320) {
					clientW = 320;
				}
				docEle.style.fontSize = clientW / ratio + "px";
				SIZE = clientW / ratio
				window.FONTSIZE = clientW / ratio
			};
		})(window, 1920); //750为设计稿宽度px值,根据实际设计稿大小对应设置
	},
	mounted: function() {
		var that = this
		$('.fensheng-down').css({
			"width": 4 * window.FONTSIZE + "px",
			"height": 2.5 * window.FONTSIZE + "px"
		})
		$('.chart-item2').css({
			"width": 4 * window.FONTSIZE + "px",
			"height": 2.5 * window.FONTSIZE + "px"
		})
		$('.china-map').css({
			"width": 8.8 * window.FONTSIZE + "px",
			"height": 6.7 * window.FONTSIZE + "px"
		})
		$('.xintiao-map').css({
			"width": 8.8 * window.FONTSIZE + "px",
			"height": 2.5 * window.FONTSIZE + "px"
		})
		this.initMapChart()
		//首次加载获取接口
		this.getTop12()
		this.getTopOther12()
		this.initXinChart()
		//心跳首次加载
		this.getDownloadPeriod()

		this.showOrHide()
		//时间
		this.setDate()
		setInterval(() => {
			this.setDate()
		}, 1000)
		this.setTime()
		setInterval(() => {
			this.setTime()
		}, 1000)

		//中间下载量
		this.setTotalDownNum().then(() => {
			//必须保证下载总量在前面获取到
			this.getScreenDataT10()

		})

		setInterval(() => { //图例接口延迟
			//接口轮询请求

			//右侧下载量
			this.getTop12()
			this.getTopOther12()

			//中间下载量
			this.setTotalDownNum().then(() => {
				//必须保证下载总量在前面获取到
				this.getScreenDataT10()

			})

		}, 1000 * 30)

	},

})