
import Area from '../../static/area.json'; //获取中国省市区三级联json格式

//获取中国省市区三级联级联选择器
export function getArea(){
    let regionOptions = [];
    for(let x of Area){ //获取省份
        let city = [];
        for(let y of x.city){ //获取城市
            let area = [];
            for(let z of y.area){ //获取地区
                area.push({value: z,label: z});
            }
            city.push({value: y.name,label: y.name,children: area});
        }
        regionOptions.push({value: x.name,label: x.name,children: city});
    }
    return regionOptions;
}



