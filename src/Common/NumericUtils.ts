
/**
 * 数字工具类
 * @author 后天 2017.9.28
 * 
 */	
module Common
{
    export class NumericUtils
    {
		/**
		 * 将两个16位数据组合为一个32位数据 
		 * @param lo 低位
		 * @param hi 高位
		 * @return 
		 * 
		 */
		public static  MakeLong(lo:number, hi:number):number
		{
			return (lo & 0xFFFF) | ((hi << 16) & 0xFFFF0000);
		}
    }
}