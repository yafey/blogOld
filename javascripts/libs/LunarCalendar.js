/**
 * ũ����������������
 * LunarCalendar
 * vervison : v0.1.4
 * Github : https://github.com/zzyss86/LunarCalendar
 * HomePage : http://www.tuijs.com/
 * Author : JasonZhou
 * Email : zzyss86@qq.com
 */

(function(){
	var extend = function(o, c){
		if(o && c && typeof c == "object"){
			for(var p in c){
				o[p] = c[p];
			}
		}
		return o;
	};
	
	var creatLenArr = function(year,month,len,start){
		var arr = [];
			start = start || 0;
		if(len<1)return arr;
		var k = start;
		for(var i=0;i<len;i++){
			arr.push({year:year,month:month,day:k});
			k++;
		}
		return arr;
	};
	
	var errorCode = { //�������б�
		100 : '�������ݳ����˿ɲ�ѯ��Χ����֧��1891��2100��',
		101 : '�����������������ĵ�'
	};
	
	var cache = null; //ĳ����ͬ�������cache���Լ��ټ����ٶ�
	var cacheUtil = { //cache������
		current : '',
		setCurrent : function(year){
			if(this.current != year){
				this.current = year;
				this.clear();
			}
		},
		set : function(key,value){
			if(!cache) cache = {};
			cache[key] = value;
			return cache[key];
		},
		get : function(key){
			if(!cache) cache = {};
			return cache[key];
		},
		clear : function(){
			cache = null;
		}
	};
	
	var formateDayD4 = function(month,day){
		month = month+1;
		month = month<10 ? '0'+month : month;
		day = day<10 ? '0'+day : day;
		return 'd'+month+day;
	};
	
	var minYear = 1890;//��С����
	var maxYear = 2100;//�������
	var DATA = {
		heavenlyStems: ['��', '��', '��', '��', '��', '��', '��', '��', '��', '��'], //���
		earthlyBranches: ['��', '��', '��', 'î', '��', '��', '��', 'δ', '��', '��', '��', '��'], //��֧
		zodiac: ['��','ţ','��','��','��','��','��','��','��','��','��','��'], //��Ӧ��֧ʮ����Ф
		solarTerm: ['С��', '��', '����', '��ˮ', '����', '����', '����', '����', '����', 'С��', 'â��', '����', 'С��', '����', '����', '����', '��¶', '���', '��¶', '˪��', '����', 'Сѩ', '��ѩ','����'], //��ʮ�Ľ���
		monthCn: ['��', '��', '��', '��', '��', '��', '��', '��', '��', 'ʮ', 'ʮһ', 'ʮ��'],
		dateCn: ['��һ', '����', '����', '����', '����', '����', '����', '����', '����', '��ʮ', 'ʮһ', 'ʮ��', 'ʮ��', 'ʮ��', 'ʮ��', 'ʮ��', 'ʮ��', 'ʮ��', 'ʮ��', '��ʮ', 'إһ', 'إ��', 'إ��', 'إ��', 'إ��', 'إ��', 'إ��', 'إ��', 'إ��', '��ʮ', 'ئһ']
	};
	
	//�й����շżٰ��ţ��ⲿ���ã�0�����ⰲ�ţ�1������2�ż�
	var worktime = {};
	//Ĭ������2013-2014��żٰ���
	worktime.y2013 = {"d0101":2,"d0102":2,"d0103":2,"d0105":1,"d0106":1,"d0209":2,"d0210":2,"d0211":2,"d0212":2,"d0213":2,"d0214":2,"d0215":2,"d0216":1,"d0217":1,"d0404":2,"d0405":2,"d0406":2,"d0407":1,"d0427":1,"d0428":1,"d0429":2,"d0430":2,"d0501":2,"d0608":1,"d0609":1,"d0610":2,"d0611":2,"d0612":2,"d0919":2,"d0920":2,"d0921":2,"d0922":1,"d0929":1,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1012":1};
	worktime.y2014 = {"d0101":2,"d0126":1,"d0131":2,"d0201":2,"d0202":2,"d0203":2,"d0204":2,"d0205":2,"d0206":2,"d0208":1,"d0405":2,"d0407":2,"d0501":2,"d0502":2,"d0503":2,"d0504":1,"d0602":2,"d0908":2,"d0928":1,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1011":1};
	worktime.y2015 = {"d0101":2,"d0102":2,"d0103":2,"d0104":1,"d0215":1,"d0218":2,"d0219":2,"d0220":2,"d0221":2,"d0222":2,"d0223":2,"d0228":1,"d0405":2,"d0406":2,"d0501":2,"d0502":2,"d0503":2,"d0620":2,"d0622":2,"d0903":2,"d0904":2,"d0905":2,"d0906":1,"d0927":2,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1010":1};
	// 2016��żٰ��� update @ 2016��1��23��04:39:53
	worktime.y2016 = {"d0101":2,"d0206":1,"d0207":2,"d0208":2,"d0209":2,"d0210":2,"d0211":2,"d0212":2,"d0213":2,"d0214":1,"d0404":2,"d0501":2,"d0502":1,"d0609":2,"d0610":2,"d0611":2,"d0612":1,"d0915":2,"d0916":2,"d0917":2,"d0918":1,"d1001":2,"d1002":2,"d1003":2,"d1004":2,"d1005":2,"d1006":2,"d1007":2,"d1008":1,"d1009":1};
	//��������
	var solarFestival = {
		'd0101':'Ԫ����',
		'd0202':'����ʪ����',
		'd0210':'���������',
		'd0214':'���˽�',
		'd0301':'���ʺ�����',
		'd0303':'ȫ��������',
		'd0305':'ѧ�׷������',
		'd0308':'��Ů��',
		'd0312':'ֲ���� ����ɽ����������',
		'd0314':'���ʾ�����',
		'd0315':'������Ȩ����',
		'd0317':'�й���ҽ�� ���ʺ�����',
		'd0321':'����ɭ���� �����������ӹ����� ���������',
		'd0322':'����ˮ��',
		'd0323':'����������',
		'd0324':'������ν�˲���',
		'd0325':'ȫ����Сѧ����ȫ������',
		'd0330':'����˹̹������',
		'd0401':'���˽� ȫ�����������˶���(����) ˰��������(����)',
		'd0407':'����������',
		'd0422':'���������',
		'd0423':'����ͼ��Ͱ�Ȩ��',
		'd0424':'�Ƿ����Ź�������',
		'd0501':'�Ͷ���',
		'd0504':'�����',
		'd0505':'��ȱ����������',
		'd0508':'�����ʮ����',
		'd0512':'���ʻ�ʿ��',
		'd0515':'���ʼ�ͥ��',
		'd0517':'���������',
		'd0518':'���ʲ������',
		'd0520':'ȫ��ѧ��Ӫ����',
		'd0522':'���������������',
		'd0523':'����ţ����',
		'd0531':'����������', 
		'd0601':'���ʶ�ͯ��',
		'd0605':'���绷����',
		'd0606':'ȫ��������',
		'd0617':'���λ�Į���͸ɺ���',
		'd0623':'���ʰ���ƥ����',
		'd0625':'ȫ��������',
		'd0626':'���ʽ�����',
		'd0701':'��ۻع������ �й����� ���罨����',
		'd0702':'��������������',
		'd0707':'����ս��������',
		'd0711':'�����˿���',
		'd0730':'���޸�Ů��',
		'd0801':'������',
		'd0808':'�й����ӽ�(�ְֽ�)',
		'd0815':'����ս��ʤ������',
		'd0908':'����ɨä�� �������Ź�������',
		'd0909':'ë����������',
		'd0910':'�й���ʦ��', 
		'd0914':'������������',
		'd0916':'���ʳ����㱣����',
		'd0918':'��һ���±������',
		'd0920':'���ʰ�����',
		'd0927':'����������',
		'd0928':'���ӵ���',
		'd1001':'����� ���������� �������˽�',
		'd1002':'���ʺ�ƽ���������ɶ�����',
		'd1004':'���綯����',
		'd1006':'���˽�',
		'd1008':'ȫ����Ѫѹ�� �����Ӿ���',
		'd1009':'���������� ���������',
		'd1010':'�������������� ���羫��������',
		'd1013':'���籣���� ���ʽ�ʦ��',
		'd1014':'�����׼��',
		'd1015':'����ä�˽�(�����Ƚ�)',
		'd1016':'������ʳ��',
		'd1017':'��������ƶ����',
		'd1022':'���紫ͳҽҩ��',
		'd1024':'���Ϲ��� ���緢չ��Ϣ��',
		'd1031':'�����ڼ���',
		'd1107':'ʮ������������������',
		'd1108':'�й�������',
		'd1109':'ȫ��������ȫ����������',
		'd1110':'���������',
		'd1111':'���ʿ�ѧ���ƽ��(����������һ��)',
		'd1112':'����ɽ����������',
		'd1114':'����������',
		'd1117':'���ʴ�ѧ���� ����ѧ����',
		'd1121':'�����ʺ��� ���������',
		'd1129':'������Ԯ����˹̹���������',
		'd1201':'���簬�̲���',
		'd1203':'����м�����',
		'd1205':'���ʾ��ú���ᷢչ־Ը��Ա��',
		'd1208':'���ʶ�ͯ������',
		'd1209':'����������',
		'd1210':'������Ȩ��',
		'd1212':'�����±������',
		'd1213':'�Ͼ�����ɱ(1937��)�����գ�����Ѫ��ʷ��',
		'd1220':'���Żع����',
		'd1221':'����������',
		'd1224':'ƽ��ҹ',
		'd1225':'ʥ����',
		'd1226':'ë�󶫵�������'
	};
	
	//ũ������
	var lunarFestival = {
		'd0101':'����',
		'd0115':'Ԫ����',
		'd0202':'��̧ͷ��',
		'd0323':'��������',
		'd0505':'�����',
		'd0707':'��Ϧ���˽�',
		'd0715':'��Ԫ��',
		'd0815':'�����',
		'd0909':'������',
		'd1015':'��Ԫ��',
		'd1208':'���˽�',
		'd1223':'С��',
		'd0100':'��Ϧ'
	}

	/**
	 * 1890 - 2100 ���ũ������
	 * ���ݸ�ʽ��[0,2,9,21936]
	 * [���������£�0Ϊû������; *���³�һ��Ӧ������; *���³�һ��Ӧ������; *ũ��ÿ�µ����������飨��ת��Ϊ������,�õ�ÿ�´�С��0=С��(29��),1=����(30��)��;]
	*/
	var lunarInfo = [[2,1,21,22184],[0,2,9,21936],[6,1,30,9656],[0,2,17,9584],[0,2,6,21168],[5,1,26,43344],[0,2,13,59728],[0,2,2,27296],[3,1,22,44368],[0,2,10,43856],[8,1,30,19304],[0,2,19,19168],[0,2,8,42352],[5,1,29,21096],[0,2,16,53856],[0,2,4,55632],[4,1,25,27304],[0,2,13,22176],[0,2,2,39632],[2,1,22,19176],[0,2,10,19168],[6,1,30,42200],[0,2,18,42192],[0,2,6,53840],[5,1,26,54568],[0,2,14,46400],[0,2,3,54944],[2,1,23,38608],[0,2,11,38320],[7,2,1,18872],[0,2,20,18800],[0,2,8,42160],[5,1,28,45656],[0,2,16,27216],[0,2,5,27968],[4,1,24,44456],[0,2,13,11104],[0,2,2,38256],[2,1,23,18808],[0,2,10,18800],[6,1,30,25776],[0,2,17,54432],[0,2,6,59984],[5,1,26,27976],[0,2,14,23248],[0,2,4,11104],[3,1,24,37744],[0,2,11,37600],[7,1,31,51560],[0,2,19,51536],[0,2,8,54432],[6,1,27,55888],[0,2,15,46416],[0,2,5,22176],[4,1,25,43736],[0,2,13,9680],[0,2,2,37584],[2,1,22,51544],[0,2,10,43344],[7,1,29,46248],[0,2,17,27808],[0,2,6,46416],[5,1,27,21928],[0,2,14,19872],[0,2,3,42416],[3,1,24,21176],[0,2,12,21168],[8,1,31,43344],[0,2,18,59728],[0,2,8,27296],[6,1,28,44368],[0,2,15,43856],[0,2,5,19296],[4,1,25,42352],[0,2,13,42352],[0,2,2,21088],[3,1,21,59696],[0,2,9,55632],[7,1,30,23208],[0,2,17,22176],[0,2,6,38608],[5,1,27,19176],[0,2,15,19152],[0,2,3,42192],[4,1,23,53864],[0,2,11,53840],[8,1,31,54568],[0,2,18,46400],[0,2,7,46752],[6,1,28,38608],[0,2,16,38320],[0,2,5,18864],[4,1,25,42168],[0,2,13,42160],[10,2,2,45656],[0,2,20,27216],[0,2,9,27968],[6,1,29,44448],[0,2,17,43872],[0,2,6,38256],[5,1,27,18808],[0,2,15,18800],[0,2,4,25776],[3,1,23,27216],[0,2,10,59984],[8,1,31,27432],[0,2,19,23232],[0,2,7,43872],[5,1,28,37736],[0,2,16,37600],[0,2,5,51552],[4,1,24,54440],[0,2,12,54432],[0,2,1,55888],[2,1,22,23208],[0,2,9,22176],[7,1,29,43736],[0,2,18,9680],[0,2,7,37584],[5,1,26,51544],[0,2,14,43344],[0,2,3,46240],[4,1,23,46416],[0,2,10,44368],[9,1,31,21928],[0,2,19,19360],[0,2,8,42416],[6,1,28,21176],[0,2,16,21168],[0,2,5,43312],[4,1,25,29864],[0,2,12,27296],[0,2,1,44368],[2,1,22,19880],[0,2,10,19296],[6,1,29,42352],[0,2,17,42208],[0,2,6,53856],[5,1,26,59696],[0,2,13,54576],[0,2,3,23200],[3,1,23,27472],[0,2,11,38608],[11,1,31,19176],[0,2,19,19152],[0,2,8,42192],[6,1,28,53848],[0,2,15,53840],[0,2,4,54560],[5,1,24,55968],[0,2,12,46496],[0,2,1,22224],[2,1,22,19160],[0,2,10,18864],[7,1,30,42168],[0,2,17,42160],[0,2,6,43600],[5,1,26,46376],[0,2,14,27936],[0,2,2,44448],[3,1,23,21936],[0,2,11,37744],[8,2,1,18808],[0,2,19,18800],[0,2,8,25776],[6,1,28,27216],[0,2,15,59984],[0,2,4,27424],[4,1,24,43872],[0,2,12,43744],[0,2,2,37600],[3,1,21,51568],[0,2,9,51552],[7,1,29,54440],[0,2,17,54432],[0,2,5,55888],[5,1,26,23208],[0,2,14,22176],[0,2,3,42704],[4,1,23,21224],[0,2,11,21200],[8,1,31,43352],[0,2,19,43344],[0,2,7,46240],[6,1,27,46416],[0,2,15,44368],[0,2,5,21920],[4,1,24,42448],[0,2,12,42416],[0,2,2,21168],[3,1,22,43320],[0,2,9,26928],[7,1,29,29336],[0,2,17,27296],[0,2,6,44368],[5,1,26,19880],[0,2,14,19296],[0,2,3,42352],[4,1,24,21104],[0,2,10,53856],[8,1,30,59696],[0,2,18,54560],[0,2,7,55968],[6,1,27,27472],[0,2,15,22224],[0,2,5,19168],[4,1,25,42216],[0,2,12,42192],[0,2,1,53584],[2,1,21,55592],[0,2,9,54560]];
	
	/**
	 * ��ʮ�Ľ������ݣ�������ʱ�䣨��λ�Ƿ��ӣ�
	 * ��0С������
	 */
	var termInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
	
	/**
	 * �ж�ũ����������
	 * @param {Number} year ũ����
	 * return ������ ���·ݴ�1��ʼ��
	 */
	function getLunarLeapYear(year){
		var yearData = lunarInfo[year-minYear];
		return yearData[0];
	};
	
	/**
	 * ��ȡũ�����һ���ÿ�µ�������һ���������
	 * @param {Number} year ũ����
	 */
	function getLunarYearDays(year){
		var yearData = lunarInfo[year-minYear];
		var leapMonth = yearData[0]; //����
		var monthData = yearData[3].toString(2);
		var monthDataArr = monthData.split('');
		
		//��ԭ������16λ,����16λ����ǰ�����0�������ƴ洢ʱǰ���0�����ԣ�
		for(var i=0;i<16-monthDataArr.length;i++){
			monthDataArr.unshift(0);
		}
		
		var len = leapMonth ? 13 : 12; //�����м�����
		var yearDays = 0;
		var monthDays = [];
		for(var i=0;i<len;i++){
			if(monthDataArr[i]==0){
				yearDays += 29;
				monthDays.push(29);
			}else{
				yearDays += 30;
				monthDays.push(30);
			}
		}
		
		return {
			yearDays : yearDays,
			monthDays : monthDays
		};
	};
	
	/**
	 * ͨ�������������ũ������
	 * @param {Number} year,between ũ���꣬�������
	 */
	function getLunarDateByBetween(year,between){
		var lunarYearDays = getLunarYearDays(year);
		var end = between>0 ? between : lunarYearDays.yearDays - Math.abs(between);
		var monthDays = lunarYearDays.monthDays;
		var tempDays = 0;
		var month = 0;
		for(var i=0;i<monthDays.length;i++){
			tempDays += monthDays[i];
			if(tempDays > end){
				month = i;
				tempDays = tempDays-monthDays[i];
				break;
			}
		}
		
		return [year,month,end - tempDays + 1];
	};

	/**
	 * ���ݾ������³�һ����������ũ������
	 * @param {Number} year �����꣬�£���
	 */
	function getLunarByBetween(year,month,day){
		var yearData = lunarInfo[year-minYear];
		var zenMonth = yearData[1];
		var zenDay = yearData[2];
		var between = getDaysBetweenSolar(year,zenMonth-1,zenDay,year,month,day);
		if(between==0){ //���³�һ
			return [year,0,1];
		}else{
			var lunarYear = between>0 ? year : year-1;
			return getLunarDateByBetween(lunarYear,between);
		}
	};
	
	/**
	 * ������������֮�������
	 */
	function getDaysBetweenSolar(year,month,day,year1,month1,day1){
		var date = new Date(year,month,day).getTime();
		var date1 = new Date(year1,month1,day1).getTime();
		return (date1-date) / 86400000;
	};
	
	/**
	 * ����ũ�����������³�һ�ж�����
	 * @param {Number} year,month,day ũ�꣬��(0-12��������)����
	 */
	function getDaysBetweenZheng(year,month,day){
		var lunarYearDays = getLunarYearDays(year);
		var monthDays = lunarYearDays.monthDays;
		var days = 0;
		for(var i=0;i<monthDays.length;i++){
			if(i<month){
				days += monthDays[i];
			}else{
				break;
			}
		};
		return days+day-1;
	};
	
	/**
	 * ĳ��ĵ�n������Ϊ����
	 * 31556925974.7Ϊ����ת���ڣ��Ǻ���
	 * 1890�����С���㣺01-05 16:02:31��1890��Ϊ��׼��
	 * @param {Number} y ������
	 * @param {Number} n �ڼ�����������0С������
	 * ����ũ��24��������ʱ�̲��ý����㷨�����ܴ����������(30������)
	 */
	function getTerm(y,n) {
		var offDate = new Date( ( 31556925974.7*(y-1890) + termInfo[n]*60000  ) + Date.UTC(1890,0,5,16,2,31) );
		return(offDate.getUTCDate());
	};
	
	/**
	 * ��ȡ������һ��Ķ�ʮ�Ľ���
	 * ����key:���ڣ�value:����������
	 */
	function getYearTerm(year){
		var res = {};
		var month = 0;
		for(var i=0;i<24;i++){
			var day = getTerm(year,i);
			if(i%2==0)month++
			res[formateDayD4(month-1,day)] = DATA.solarTerm[i];
		}
		return res;
	};
	
	/**
	 * ��ȡ��Ф
	 * @param {Number} year ��֧�����꣨Ĭ��������ǰ�Ĺ�������Ϊ������
	 */
	function getYearZodiac(year){
		 var num = year-1890+25; //�ο���֧����ļ��㣬��Ф��Ӧ��֧
		 return DATA.zodiac[num%12];
	};
	
	/**
	 * ������ɵ�֧
	 * @param {Number} num 60�����е�λ��(��60����ɵ�֧������һ��60���Ƶ���)
	 */
	function cyclical(num) {
		return(DATA.heavenlyStems[num%10]+DATA.earthlyBranches[num%12]);
	}
	
	/**
	 * ��ȡ��֧����
	 * @param {Number} year ��֧������
	 * @param {Number} offset ƫ������Ĭ��Ϊ0�����ڲ�ѯһ�����������֧���꣨������Ϊ�ֽ��ߣ�
	 */
	function getLunarYearName(year,offset){
		offset = offset || 0;
		//1890��1��С����С��һ����1��5��6�գ���ǰΪ�����꣬��60��������25
		return cyclical(year-1890+25+offset);
	};
	
	/**
	 * ��ȡ��֧����
	 * @param {Number} year,month �����꣬��֧������
	 * @param {Number} offset ƫ������Ĭ��Ϊ0�����ڲ�ѯһ���¿�������֧���£���������2�£�
	 */
	function getLunarMonthName(year,month,offset){
		offset = offset || 0;
		//1890��1��С����ǰΪ�����£���60��������12
		return cyclical((year-1890)*12+month+12+offset);
	};
	
	/**
	 * ��ȡ��֧����
	 * @param {Number} year,month,day �����꣬�£���
	 */
	function getLunarDayName(year,month,day){
		//������1890/1/1 �������
		//1890/1/1�� 1970/1/1 ���29219��, 1890/1/1 ����Ϊ������(60����18)
		var dayCyclical = Date.UTC(year,month,day)/86400000+29219+18;
		return cyclical(dayCyclical);
	};
	
	/**
	 * ��ȡ�����·ݵ�����
	 * @param {Number} year ������
	 * @param {Number} month ������
	 */
	function getSolarMonthDays(year,month){
		 var monthDays = [31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31];
		 return monthDays[month];
	};
	
	/**
	 * �жϹ������Ƿ�������
	 * @param {Number} year ������
	 */
	function isLeapYear(year){
		return ((year%4==0 && year%100 !=0) || (year%400==0));
	};
		
	/*
	 * ͳһ������������������·ݴ�1��ʼ���ڲ��·�ͳһ��0��ʼ��
	 */
	function formateDate(year,month,day,_minYear){
		var argsLen = arguments.length;
		var now = new Date();
		year = argsLen ? parseInt(year,10) : now.getFullYear();
		month = argsLen ? parseInt(month-1,10) : now.getMonth();
		day = argsLen ? parseInt(day,10) || now.getDate() : now.getDate();
		if(year < (_minYear ? _minYear : minYear+1) || year > maxYear)return {error:100, msg:errorCode[100]};
		return {
			year : year,
			month : month,
			day : day
		};
	};
	
	/**
	 * ��ũ��ת��Ϊ����
	 * @param {Number} year,month,day ũ���꣬��(1-13��������)����
	 */
	function lunarToSolar(_year,_month,_day){
		var inputDate = formateDate(_year,_month,_day);
		if(inputDate.error)return inputDate;
		var year = inputDate.year;
		var month = inputDate.month;
		var day = inputDate.day;
		
		var between = getDaysBetweenZheng(year,month,day); //�����³�һ������
		var yearData = lunarInfo[year-minYear];
		var zenMonth = yearData[1];
		var zenDay = yearData[2];
		
		var offDate = new Date(year,zenMonth-1,zenDay).getTime() + between * 86400000;
			offDate = new Date(offDate);
		return {
			year : offDate.getFullYear(),
			month : offDate.getMonth()+1,
			day : offDate.getDate()
		};
	};
	
	/**
	 * ������ת��Ϊũ��
	 * @param {Number} year,month,day �����꣬�£���
	 */
	function solarToLunar(_year,_month,_day){
		var inputDate = formateDate(_year,_month,_day,minYear);
		if(inputDate.error)return inputDate;
		var year = inputDate.year;
		var month = inputDate.month;
		var day = inputDate.day;
		
		cacheUtil.setCurrent(year);
		//��������
		var term2 = cacheUtil.get('term2') ? cacheUtil.get('term2') : cacheUtil.set('term2',getTerm(year,2));
		//��ʮ�Ľ���
		var termList = cacheUtil.get('termList') ? cacheUtil.get('termList') : cacheUtil.set('termList',getYearTerm(year));
		
		var firstTerm = getTerm(year,month*2); //ĳ�µ�һ��������ʼ����
		var GanZhiYear = (month>1 || month==1 && day>=term2) ? year+1 : year;//��֧�������
		var GanZhiMonth = day>=firstTerm ? month+1 : month; //��֧�����·ݣ��Խ���Ϊ�磩
		
		var lunarDate = getLunarByBetween(year,month,day);
		var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
		var lunarMonthName = '';
		if(lunarLeapMonth>0 && lunarLeapMonth==lunarDate[1]){
			lunarMonthName = '��'+DATA.monthCn[lunarDate[1]-1]+'��';
		}else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
			lunarMonthName = DATA.monthCn[lunarDate[1]-1]+'��';
		}else{
			lunarMonthName = DATA.monthCn[lunarDate[1]]+'��';
		}
		
		//ũ�������ж�
		var lunarFtv = '';
		var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;
		//��Ϧ
		if(lunarDate[1] == lunarMonthDays.length-1 && lunarDate[2]==lunarMonthDays[lunarMonthDays.length-1]){
			lunarFtv = lunarFestival['d0100'];
		}else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
			lunarFtv = lunarFestival[formateDayD4(lunarDate[1]-1,lunarDate[2])];
		}else{
			lunarFtv = lunarFestival[formateDayD4(lunarDate[1],lunarDate[2])];
		}
		
		var res = {
			zodiac : getYearZodiac(GanZhiYear),
			GanZhiYear : getLunarYearName(GanZhiYear),
			GanZhiMonth : getLunarMonthName(year,GanZhiMonth),
			GanZhiDay : getLunarDayName(year,month,day),
			//�żٰ��ţ�0�����ⰲ�ţ�1������2�ż�
			worktime : worktime['y'+year] && worktime['y'+year][formateDayD4(month,day)] ? worktime['y'+year][formateDayD4(month,day)] : 0,
			term : termList[formateDayD4(month,day)],
			
			lunarYear : lunarDate[0],
			lunarMonth : lunarDate[1]+1,
			lunarDay : lunarDate[2],
			lunarMonthName : lunarMonthName,
			lunarDayName : DATA.dateCn[lunarDate[2]-1],
			lunarLeapMonth : lunarLeapMonth,
			
			solarFestival : solarFestival[formateDayD4(month,day)],
			lunarFestival : lunarFtv
		};

		return res;
	};
	
	/**
	 * ��ȡָ�������·ݵ�ũ������
	 * return res{Object}
	 * @param {Number} year,month �����꣬��
	 * @param {Boolean} fill �Ƿ������������ݲ�����β��ȱ���������ݴ����տ�ʼ
	 */
	function calendar(_year,_month,fill){
		var inputDate = formateDate(_year,_month);
		if(inputDate.error)return inputDate;
		var year = inputDate.year;
		var month = inputDate.month;
		
		var calendarData = solarCalendar(year,month+1,fill);
		for(var i=0;i<calendarData.monthData.length;i++){
			var cData = calendarData.monthData[i];
			var lunarData = solarToLunar(cData.year,cData.month,cData.day);
			extend(calendarData.monthData[i],lunarData);
		}
		return calendarData;
	};
	
	/**
	 * ����ĳ������
	 * return res{Object}
	 * @param {Number} year,month �����꣬��
	 * @param {Boolean} fill �Ƿ������������ݲ�����β��ȱ���������ݴ����տ�ʼ (7*6����)
	 */
	function solarCalendar(_year,_month,fill){
		var inputDate = formateDate(_year,_month);
		if(inputDate.error)return inputDate;
		var year = inputDate.year;
		var month = inputDate.month;
		
		var firstDate = new Date(year,month,1);
		var preMonthDays,preMonthData,nextMonthData;
		
		var res = {
			firstDay : firstDate.getDay(), //����1�����ڼ�
			monthDays : getSolarMonthDays(year,month), //��������
			monthData : []
		};
		
		res.monthData = creatLenArr(year,month+1,res.monthDays,1);

		if(fill){
			if(res.firstDay > 0){ //ǰ��
				var preYear = month-1<0 ? year-1 : year;
				var preMonth = month-1<0 ? 11 : month-1;
				preMonthDays = getSolarMonthDays(preYear,preMonth);
				preMonthData = creatLenArr(preYear,preMonth+1,res.firstDay,preMonthDays-res.firstDay+1);
				res.monthData = preMonthData.concat(res.monthData);
			}
			
			if(7*6 - res.monthData.length!=0){ //��
				var nextYear = month+1>11 ? year+1 : year;
				var nextMonth = month+1>11 ? 0 : month+1;
				var fillLen = 7*6 - res.monthData.length;
				nextMonthData = creatLenArr(nextYear,nextMonth+1,fillLen,1);
				res.monthData = res.monthData.concat(nextMonthData);
			}
		}
		
		return res;
	};
	
	/**
	 * ���÷żٰ��š����Ⱪ¶�ӿڡ�
	 * @param {Object} workData
	 */
	function setWorktime(workData){
		extend(worktime,workData);
	};

	var LunarCalendar = {
		solarToLunar : solarToLunar,
		lunarToSolar : lunarToSolar,
		calendar : calendar,
		solarCalendar : solarCalendar,
		setWorktime : setWorktime,
		getSolarMonthDays : getSolarMonthDays
	};
	
	if (typeof define === 'function'){
		define (function (){
			return LunarCalendar;
		});
	}else if(typeof exports === 'object'){
		module.exports = LunarCalendar;
	}else{
		window.LunarCalendar = LunarCalendar;
	};
})();
