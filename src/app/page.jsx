"use client"
import React from 'react'

const Page = () => {

  const [Popup, setPopup] = React.useState({ id: "initial", shown: false })
  const [currentPopupId, setcurrentPopupId] = React.useState("")
  const [TargetText, setTargetText] = React.useState("")
  const [InitialselectedLanguage, setInitialselectedLanguage] = React.useState("auto")
  const [InitialselectedLanguageCode, setInitialselectedLanguageCode] = React.useState("")
  const [targetselectedLanguage, settargetselectedLanguage] = React.useState("english")
  const [targetselectedLanguageCode, settargetselectedLanguageCode] = React.useState("en")
  const [languageList, setlanguageList] = React.useState([])
  const [translatedData, settranslatedData] = React.useState("...")
  const [ProgressState, setProgressState] = React.useState("inactive")


  const apiURI = "http://127.0.0.1:5000"


  const getTranslation = (source, word, target_language) => {
    let formData = new FormData;
    formData.append("src", source)
    formData.append("sentence", word)
    formData.append("target-language", target_language)
    setProgressState("active")
    
    if(word && word !== ""){

      
      fetch(`${apiURI}/get_translation`, { method: "POST", body: formData })
      .then(result => { return result.json() })
      .then(data => {
        settranslatedData(data.message)
        setProgressState("inactive")
      })
      .catch(err => {
        console.log(err)
        setProgressState("inactive")
      })
    }else{
      alert("type something before you translate.")
      setProgressState("inactive")
    }
  }


  React.useEffect(() => {
    fetch(`${apiURI}/get_language_data`, { method: "GET" })
      .then(result => { return result.json() })
      .then(data => {
        setlanguageList(data.list)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <>

      <div className='w-full p-5 flex flex-row flex-wrap items-center justify-center   mt-[10vh]'>
        <div className='w-full max-w-[600px] min-h-[300px] bg-white border-[1px] rounded-[20px] p-5'>
          <div className='h-[70px] w-full border-b-[1px] flex flex-row items-center justify-around'>
            <div className='w-[200px] relative'>
              <button
                className='bg-[whitesmoke] max-w-[200px] w-full h-[50px] rounded-[10px] active:opacity-[0.5] flex flex-row items-center justify-around'
                onClick={() => {
                  setPopup({ id: "initial", shown: true })
                  setcurrentPopupId("initial")
                }}><b>{InitialselectedLanguage}</b> <img src='/code.svg' className='w-[15px] h-[15px] rotate-[90deg]' /></button>
              {
                Popup.shown && Popup.id === "initial" &&
                <>
                  <div className='w-full h-[100vh] bg-none fixed left-0 top-0' onClick={() => setPopup(false)}></div>
                  <div className='w-full h-[300px] bg-[white] absolute left-0 rounded-[5px] border-[1px] overflow-y-scroll'>
                    <div onClick={() => {
                      setInitialselectedLanguage("auto")
                      setInitialselectedLanguageCode("auto")
                      setPopup({ id: "initial", shown: false })
                    }}
                      className={`w-full h-[50px] border-b-[1px]  flex flex-row items-center p-2 active:opacity-[0.5] cursor-pointer`}>auto</div>
                    {
                      languageList.map((language, index) => {
                        return (
                          <div key={index} onClick={() => {
                            setInitialselectedLanguage(language.name)
                            setInitialselectedLanguageCode(language.code)
                            setPopup({ id: "initial", shown: false })
                          }}
                            className={`w-full h-[50px] ${index !== languageList.length - 1 ? "border-b-[1px]" : ""} flex flex-row items-center p-2 active:opacity-[0.5] cursor-pointer`}>{language.name}</div>
                        )
                      })
                    }
                  </div>
                </>
              }

            </div>

            <div className='min-w-[35px] min-h-[35px] bg-black rounded-[100px] flex items-center justify-center text-white text-[14px] mx-[20px]'><img src='/maximize.svg' className='w-[15px] h-[15px] rotate-[30deg]' /></div>

            <div className='w-[200px] relative'>
              <button
                className='bg-[whitesmoke] max-w-[200px] w-full h-[50px] rounded-[10px] active:opacity-[0.5] flex flex-row items-center justify-around'
                onClick={() => {
                  setPopup({ id: "target", shown: true })
                  setcurrentPopupId("target")
                }}><b>{targetselectedLanguage}</b> <img src='/code.svg' className='w-[15px] h-[15px] rotate-[90deg]' /></button>
              {
                Popup.shown && Popup.id === "target" &&
                <>
                  <div className='w-full h-[100vh] bg-none fixed left-0 top-0' onClick={() => setPopup(false)}></div>
                  <div className='w-full h-[300px] bg-[white] absolute left-0 rounded-[5px] border-[1px] overflow-y-scroll'>
                    {
                      languageList.map((language, index) => {
                        return (
                          <div key={index} onClick={() => {
                            settargetselectedLanguage(language.name)
                            settargetselectedLanguageCode(language.code)
                            setPopup({ id: "target", shown: false })
                          }}
                            className={`w-full h-[50px] ${index !== languageList.length - 1 ? "border-b-[1px]" : ""} flex flex-row items-center p-2 active:opacity-[0.5] cursor-pointer`}>{language.name}</div>
                        )
                      })
                    }
                  </div>
                </>
              }

            </div>
          </div>

          <br />
          <textarea name="" id="" className='w-full h-[100px] resize-none mt-[20px] text-[25px] border-b-[1px] outline-none' placeholder='Type your word!' onInput={(e) => setTargetText(e.target.value)}></textarea>
          {
            ProgressState == "active" ?

              <div className='w-full flex flex-row  justify-center'>
                <div className='anim'></div>
              </div> : null
          }
          <br />
          <br />
          <b>Output:</b>
          <div name="" id="" className='w-full h-[100px] resize-none mt-[20px] text-[25px]' >{translatedData}</div>
          <div className='w-full flex flex-row items-center justify-end'>
            <button className='w-[100px] h-[50px] text-white bg-black rounded-[5px]' onClick={() => {
              translatedData !== "..." ? setProgressState(translatedData) : null
              getTranslation(InitialselectedLanguageCode, TargetText, targetselectedLanguageCode)
            }}>Translate</button>

          </div>
        </div>

      </div>

      <footer className='w-full min-h-[30vh] bg-white mt-[20px] text-black p-5 border-t-[1px]'>
        <div>
          <b className='text-[24px]'>{'</> Translator'}</b>
          <p className='text-[14px]'>Made with next.js and python</p>
          <p className='text-[14px]'> by Timothy Adebogun</p>
          <br />
          <b className='text-[18px] mt-[20px]'>Source Code:</b>
          <br />
          <div className='w-full flex flex-row items-center justify-start gap-[20px]'>
            <button className='bg-black w-[150px] h-[50px] rounded-[10px] p-0 flex flex-row items-center justify-center gap-[20px] text-white text-[14px]'> <img src='/github.svg' className='w-[20px] h-[20px]' /> frontend</button>
            <button className='bg-black w-[150px] h-[50px] rounded-[10px] p-0 flex flex-row items-center justify-center gap-[20px] text-white text-[14px]'> <img src='/github.svg' className='w-[20px] h-[20px]' /> backend</button>
          </div>
          
        </div>
      </footer>

    </>
  )
}

export default Page
