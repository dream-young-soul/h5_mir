module UI
{
    export class Shortcut extends ui.Main.shortcutUI
    {
        constructor()
        {
            super();
            this.m_btn_role.on(Laya.Event.CLICK,this,this.OnRoleBtnClick);
            this.m_btn_skill.on(Laya.Event.CLICK,this,this.OnSkillBtnClick);
        }

        private OnRoleBtnClick():void
        {
            UI.UIManager.GetInstance().ShowDialog(UI.UIDialogID.Role);
        }

        private OnSkillBtnClick():void
        {
             UI.UIManager.GetInstance().ShowDialog(UI.UIDialogID.Skill);
        }
    }
}