import React from 'react'

export default function messages(props) {
  console.log(props.userData)
  return (
    
    <div className="w-full">
    {props.message.first_name !== props.userData.first_name && props.message.sender_id !== props.userData.id 
    ? (// RECEIVER (LEFT)
        <div className="flex justify-start my-1">
          <div className="ml-3 inline-block max-w-[40%] rounded-md bg-green-500 p-3">
              <p
              className="whitespace-pre-wrap"
              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
              >
              {props.message.message}
              </p>
          </div>
        </div>
    ) : (
        // SENDER (RIGHT)
        <div className="flex justify-end my-1 ">
        <div className="mr-3 inline-block max-w-[40%] rounded-md bg-green-500 p-3">
            <p
            className="whitespace-pre-wrap"
            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
            >
            {props.message.message}
            </p>
        </div>
        </div>
    )}
    </div>


      
    
  )
}
