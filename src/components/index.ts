/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */
import AuthCode, { AuthCodeRef } from './AuthCode';
import Footer from './Footer';
import { Question, SelectLang } from './RightContent';
import { AvatarDropdown, AvatarName } from './RightContent/AvatarDropdown';

export { AuthCode, Footer, Question, SelectLang, AvatarDropdown, AvatarName };
export type { AuthCodeRef };
