/**
 * @description 常用公共工具函数
 */

import { setting } from '@/config/setting';
const { title } = setting;

export const getPageTitle = (pageTitle) => {
  if (pageTitle) {
    return `${pageTitle}-${title}`;
  }
  return `${title}`;
};

//获取图片路径
export function getSrc(name, type = 'png') {
  let imgValue = new URL(`/src/assets/${name}.${type}`, import.meta.url).href;
  return imgValue;
}
