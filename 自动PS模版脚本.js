// 自定义 trim 函数
function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

// 生成随机倾斜角度
function getRandomAngle(min, max) {
    // 使用 Math.sin 生成 0 到 1 之间的非均匀随机数
    const randomValue = Math.sin(Math.random() * Math.PI / 2);

    // 计算范围并保留 1 位小数
    const range = max - min;
    const scaledValue = min + randomValue * range;

    // 四舍五入保留 1 位小数
    return Math.round(scaledValue * 10) / 10;
}

// 生成min到max之间的整数
function getRandomInt(min, max) {
    // 确保 min 和 max 是整数
    min = Math.ceil(min);
    max = Math.floor(max);

    // 生成并返回随机整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成固定长度的随机数字
function getRandomNumber(a, b) {
    // 确定随机生成的长度
    let length;
    if (typeof b === 'undefined') {
        length = a;
    } else {
        const minLen = Math.min(a, b);
        const maxLen = Math.max(a, b);
        length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    }

    // 生成对应长度的随机数字
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机日期（月和日）
function getRandomDate() {
    var month = Math.floor(Math.random() * 12) + 1; // 生成 1-12 的月份
    var day = Math.floor(Math.random() * 31) + 1; // 生成 1-31 的日期

    // 确保日期有效
    if (month === 2 && day > 28) day = 28; // 2 月最多 28 天
    if ([4, 6, 9, 11].includes(month) && day > 30) day = 30; // 4、6、9、11 月最多 30 天

    return { month: month, day: day };
}

// 生成随机日期（月和日），并确保资格日期在交付日期的5天到15天之内且小于交付日期
function getRandomQualificationDate(deliveryDate) {
    // 默认年份为6
    const defaultYear = 2024;

    // 将交付日期转换为 Date 对象
    let deliveryDateObj = new Date(defaultYear, deliveryDate.month - 1, deliveryDate.day);

    // 计算资格日期的范围（交付日期的5天到15天之前）
    let minQualificationDate = new Date(deliveryDateObj);
    minQualificationDate.setDate(deliveryDateObj.getDate() - 25);

    let maxQualificationDate = new Date(deliveryDateObj);
    maxQualificationDate.setDate(deliveryDateObj.getDate() - 10);

    // 随机生成一个在范围内的日期
    let qualificationDate = new Date(
        minQualificationDate.getTime() +
        Math.random() * (maxQualificationDate.getTime() - minQualificationDate.getTime())
    );

    // 返回资格日期的年、月、日
    return {
        year: JpYear(qualificationDate.getFullYear().toString()).jpYear,
        month: qualificationDate.getMonth() + 1,
        day: qualificationDate.getDate()
    };
}

// 生成 CSV 数据
function generateCSVData(data) {
    let csvDataTitle = "图像路径 (imagePath),图层信息 (layerInfo),输出路径 (outputPath),倾斜角度 (angle)\n";

    data.forEach(item => {
        var angle = getRandomAngle(-12, 12); // 生成 -5 到 5 的倾斜角度
        // 生成图层信息
        const layerInfo = generateLayerInfo(item);

        console.log(layerInfo);

        // 添加到 CSV 数据
        csvDataTitle += `${item.psdPath},${layerInfo},${item.id},${angle}\n`;
    });

    return csvDataTitle;
}


// 生成图层信息
function generateLayerInfo(item) {
    const modeloObjectName = '基础信息图层1/';
    let layerInfo = generateBaseLayerInfo(modeloObjectName, item);

    const templateType = item.psdPath.split('-')[2];
    const templateHandlers = {
        "模版1.psd": () => generateTemplate1Info(modeloObjectName, item),
        "模版2.psd": () => generateTemplate2Info(modeloObjectName, item),
        "模版3.psd": () => generateTemplate3Info(modeloObjectName, item)
    };

    if (templateHandlers[templateType]) {
        layerInfo += templateHandlers[templateType]();
    }

    return layerInfo;
}

// 生成基础图层信息
function generateBaseLayerInfo(name, item) {
    // 生成交付年月日
    const deliveryDate = getRandomDate();
    const deliveryYear = 6; // 交付年固定为 6
    const deliveryMonth = deliveryDate.month;
    const deliveryDay = deliveryDate.day;
    // 生成资格年月日
    const qualificationDate = getRandomQualificationDate(deliveryDate);
    const qualificationYear = qualificationDate.year; // 使用返回的年份
    const qualificationMonth = qualificationDate.month;
    const qualificationDay = qualificationDate.day;

    const jpDates = JpYear(item.birthDate) // 中国日期转换日本日期

    return `${name}出生年号:${jpDates.era};` +
        `${name}出生年:${jpDates.jpYear};` +
        `${name}出生月:${jpDates.jpMonth};` +
        `${name}出生日:${jpDates.jpDate};` +
        `${name}性别:${item.sex};` +
        `${name}交付年:${deliveryYear};` +
        `${name}交付月:${deliveryMonth};` +
        `${name}交付日:${deliveryDay};` +
        `${name}资格年:${qualificationYear};` +
        `${name}资格月:${qualificationMonth};` +
        `${name}资格日:${qualificationDay};`;
}

// 生成模版1信息
function generateTemplate1Info(name, item) {
    return `${name}记号:${getRandomNumber(8)};` +
        `${name}番号:${getRandomNumber(3)};` +
        `${name}证件右上角编号:${getRandomNumber(5)};` +
        `${name}汉姓:${item.lastName};` +
        `${name}汉名:${item.fastName};` +
        `${name}假姓:${item.falseLastName};` +
        `${name}假名:${item.falseFastName};` +
        `${name}枝番:${getRandomNumber(2, 3)}`;
}

// 生成模版2信息
function generateTemplate2Info(name, item) {
    return `${name}记号:${getRandomNumber(8)};` +
        `${name}番号:${getRandomNumber(3)};` +
        `${name}证件右上角编号:${getRandomNumber(5)};` +
        `${name}中文全名:${item.lastName}  ${item.fastName};` +
        `${name}片假全名:${item.falseLastName}  ${item.falseFastName};`;
}

// 生成模版3信息
function generateTemplate3Info(name, item) {
    return `${name}记号:${getRandomNumber(4)};` +
        `${name}番号:${getRandomNumber(4, 5)};` +
        `${name}中文全名:${item.lastName}  ${item.fastName};` +
        `${name}右下角编号:000${getRandomNumber(6)}`;
}

// 保存 CSV 文件
function saveCSVFile(csvData, filePath) {
    var blob = new Blob([csvData], { type: 'text/csv' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filePath;
    link.click();
}


// 开始编写自动生成数据
let csvData = [];
let showData = ``;
// 模版数据集
let modelData = {
    "東京": "東京",
    "埼玉": "埼玉",
    "大阪": "大阪",
    "神奈川": "神奈川",
    "栃木": "栃木",
    "広島": "広島",
    "茨城": "茨城",
    "千葉": "千葉",
    "愛知": "愛知",
    "静岡": "静岡",
    "兵庫": "兵庫",
    "宮崎": "宮崎",
    "宮城": "宮城",
    "岐阜": "岐阜",
    "岡山": "岡山",
    "福岡": "福岡",
    "佐賀": "佐賀",
    "大分": "大分",
    "新潟": "新潟",
    "長崎": "長崎",
    "香川": "香川",
    "山梨": "山梨",
    "石川": "石川",
}

let allData = {
    'numEntries': $('#numValue').val() * 1, //生成条数
    'info': {
        'psdPath': '', //访问模版的路径
        'id': '', //导出的图片证件名
        'name': '', //名字
        'lastName': '',//姓
        'fastName': '',//名
        'falseLastName': '',//假姓
        'falseFastName': '',//假名
        'dist': '', //地区
        'sex': $('#sexSelect').val(),  //性别
        'birthDate': '', //出生日期
        'avatar': 'NA', //头像
        'minGivenYear': $('#minGivenYear').val(), //起始年份
        'maxGivenYear': $('#maxGivenYear').val(),  //截止年份
    }
}

// 地区数据
let district = [
    '埼玉', '大阪', '神奈川', '東京', '栃木', '広島', '茨城', '山形', '群馬', '千葉',
    '長野', '愛知', '静岡', '兵庫', '高知', '熊本', '宮崎', '宮城', '秋田', '岐阜',
    '岡山', '愛媛', '福岡', '佐賀', '大分', '新潟', '長崎', '香川', '山梨', '石川'
];

// 生成基础数据
async function generateData() {
    showData = '';
    csvData = [];

    // 使用 Promise 来封装 XMLHttpRequest
    const fetchNames = (sex) => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("get", `./自动PS名字模版-${sex}.txt`);
            request.send(null);
            request.onload = function () {
                if (request.status === 200) {
                    resolve(request.responseText.split("\r\n"));
                } else {
                    reject(new Error(`Failed to fetch names: ${request.status}`));
                }
            };
            request.onerror = function () {
                reject(new Error('Network error'));
            };
        });
    };

    try {

        const promises = [];
        const usedNames = new Set();
        const usedBirthDates = new Set(); // 用于存储已生成的出生日期

        for (let index = 1; index < ($('#numValue').val() * 1) + 1; index++) {
            // 将每个异步操作包装成 Promise
            const promise = (async () => {
                // 随机性别
                if ($('#sexSelect').children('option:selected').val() == '随机') {
                    const genders = Math.floor(Math.random() * Number(allData.numEntries) + 1);
                    allData.info.sex = genders % 2 == 0 ? '男' : '女';
                }
                let sex = allData.info.sex;

                const getUniqueName = async () => {
                    const nameArr = await fetchNames(allData.info.sex);
                    let newNameArr;
                    do {
                        newNameArr = nameArr[Math.floor(Math.random() * nameArr.length)];
                    } while (usedNames.has(newNameArr));
                    usedNames.add(newNameArr);
                    return newNameArr.split('----');
                };

                const newNameArr = await getUniqueName();

                // 性别
                allData.info.sex = sex;

                // 随机名字
                allData.info.name = newNameArr[0];
                allData.info.lastName = newNameArr[1];
                allData.info.fastName = newNameArr[2];
                allData.info.falseLastName = newNameArr[3];
                allData.info.falseFastName = newNameArr[4];

                // 随机地区
                allData.info.dist = district[Math.floor(Math.random() * district.length)];

                let modelVal = $('#modelSelect').children('option:selected').val();
                let templateNumber = ``;
                // 模版路径：model-東京-模版1.psd
                const basePath = "model/model";
                const defaultDist = "東京";
                const dist = modelData[allData.info.dist] ?? defaultDist;
                if (modelVal === "随机模版") {
                    const index = getRandomInt(1, ($('#modelSelect').children('option').length - 1));
                    templateNumber = index != 3 ? `${basePath}-${dist}-模版${index}.psd` : `${basePath}-${defaultDist}-模版${index}.psd`;
                } else {
                    templateNumber = `${basePath}-${dist}-模版${modelVal}.psd`;
                }
                allData.info.psdPath = templateNumber;

                // 随机出生日期
                let birthDate;
                do {
                    let birthsDate = getRandomDate();
                    birthDate = `${randomFrom(allData.info.minGivenYear, allData.info.maxGivenYear)}${String(birthsDate.month).padStart(2, '0')}${String(birthsDate.day).padStart(2, '0')}`;
                } while (usedBirthDates.has(birthDate)); // 检查日期是否已使用
                usedBirthDates.add(birthDate); // 将新日期添加到已使用集合中
                allData.info.birthDate = birthDate;

                // 自增长证件名称
                $("#dataTypeSelect").children('option:selected').val() == 'marrish' ? allData.info.id = `${allData.info.birthDate}.jpg` : allData.info.id = `temp (${index}).jpg`;

                csvData.push({ ...allData.info });
                showData += `----BB----${allData.info.name}----${allData.info.dist}----${allData.info.sex}----${allData.info.birthDate}----NA----${allData.info.id}----5\n`;
            })();

            promises.push(promise);
        }

        // 等待所有异步操作完成
        await Promise.all(promises);
        $('#dataTxt').val(showData);
    } catch (error) {
        console.error('Error generating data:', error);
    }
}

// 监听生成数量
$('#numValue').change(function () {
    allData.info.numEntries = $(this).val();
})
// 监听性别
$('#sexSelect').change(function () {
    allData.info.sex = $(this).children('option:selected').val();
})
//监听起始年份
$('#minGivenYear').change(function () {
    allData.info.minGivenYear = $(this).val();
})
//监听截止年份
$('#maxGivenYear').change(function () {
    allData.info.maxGivenYear = $(this).val();
})

function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * ((upperValue * 1) - (lowerValue * 1) + 1) + (lowerValue * 1));
}

// 根据中国年份换算日本年份
function JpYear(dateStr) {
    let date = new Date(`${dateStr.substring(0, 4)}-${dateStr.substring(4, 6) || '01'}-${dateStr.substring(6) || '01'}`);

    // 定义日本年号
    const eras = [
        { name: '令和', start: new Date('2019-05-01'), end: new Date() },
        { name: '平成', start: new Date('1989-01-08'), end: new Date('2019-04-30') },
        { name: '昭和', start: new Date('1926-12-25'), end: new Date('1989-01-07') },
        { name: '大正', start: new Date('1912-07-30'), end: new Date('1926-12-24') },
        { name: '明治', start: new Date('1868-01-25'), end: new Date('1912-07-29') },
    ];

    // 找到对应的日本年号
    const era = eras.find((era) => date >= era.start && date <= era.end);

    // 计算日本年份
    const year = date.getFullYear() - era.start.getFullYear() + 1;

    // 返回日本日期字符串
    return {
        'era': era.name,
        'jpYear': year,
        'jpMonth': date.getMonth() + 1,
        'jpDate': date.getDate()
    };
}


// 点击生成数据触发
$('#dataButt').on('click', async function () {
    try {
        // 1. 生成基础数据（等待异步操作完成）
        await generateData();

        // 2. 生成CSV数据
        let csvFileData = generateCSVData(csvData);

        // 3. 保存 CSV 文件
        saveCSVFile(csvFileData, "自动生成数据.csv");
    } catch (error) {
        console.error('生成数据或保存文件时出错:', error);
    }
});