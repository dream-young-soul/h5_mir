//音效管理

 class SoundInfo
{
    public _szFile:string ="";
    public _nLastTick:number = 0;
}


 class SoundManager
{
    public static readonly GAME_RUN:number = 9;    //跑步
    public static readonly GAME_WALK:number = 10;   //走路
    public static readonly GAME_NORMAL_ATTACK:number = 11;  //普通攻击
    private m_sBackFile:string = "";    //背景音乐
    private m_ArrSound:Array<SoundInfo>;
    
    private static _Instance:SoundManager = null;
    constructor()
    {
        Laya.SoundManager.autoReleaseSound = false;
       
        this.m_ArrSound = new Array<SoundInfo>();
    }

    public static GetInstance():SoundManager
    {
        if(SoundManager._Instance == null)
        {
            SoundManager._Instance = new SoundManager();
        }
        return SoundManager._Instance;
    }
    
    public PlayBackMusic(sBackMusic:string,nPlayCount:number = 0):void
    {
        if(this.m_sBackFile != "")
        {
            Laya.SoundManager.stopMusic();
            Laya.SoundManager.destroySound(sBackMusic);
        
        }
        this.m_sBackFile = sBackMusic;
        Laya.SoundManager.playMusic(sBackMusic,nPlayCount);
    }

    public PlayGameSound(id:number):void
    {
        let s:string = id.toString();
        while(s.length < 5)
        {
            s = "0" + s;
        }
        s = "data/sound/game/"+s+".mp3";
        this.PlaySoundByFile(s);
    }
    public PlayEffectSound(id:number):void
    {
        let s:string = id.toString();
        while(s.length < 5)
        {
             s = "0" + s;
        }
        s = "data/sound/effect/"+s+".mp3";
        this.PlaySoundByFile(s);
    }
    public PlaySoundByFile(sFile:string):void
    {
        for(let i:number = 0;i < this.m_ArrSound.length;i++)
        {
            if(sFile == this.m_ArrSound[i]._szFile)
            {
                Laya.SoundManager.playSound(sFile);
                this.m_ArrSound[i]._nLastTick = Config.GlobalConfig.s_dwUpdateTick + Config.GlobalConfig._Instance._nClearFreeMemoryTime;
                return;
            }
        }

        let pSoundInfo:SoundInfo = new SoundInfo();
        pSoundInfo._szFile = sFile;
        pSoundInfo._nLastTick = Config.GlobalConfig.s_dwUpdateTick + Config.GlobalConfig._Instance._nClearFreeMemoryTime;
        this.m_ArrSound.push(pSoundInfo);
        Laya.SoundManager.playSound(sFile);
    }
    public Upadte(nCurrentTick:number):void
    {
        let pCfg:Config.GlobalConfig = Config.GlobalConfig._Instance;
        for(let i:number = this.m_ArrSound.length - 1;i >= 0 ;i--)
        {
            if(this.m_ArrSound[i]._nLastTick <=  nCurrentTick )
            {
                Laya.SoundManager.destroySound(this.m_ArrSound[i]._szFile);
                this.m_ArrSound.splice(i,1);
            }
        }
    }
}