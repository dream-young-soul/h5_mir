/*
*   实体类型
*   @author 后天 2017.9.30
*/
module Entity
{
    export enum EntityType
    {
        Player = -1,   //主玩家
        Human = 0,          //玩家类
        Monster =1,         //怪物
        Npc = 2,            //NPC
        DropItem = 3,       //掉落道具
        
    }
}