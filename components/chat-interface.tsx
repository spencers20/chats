'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: number
  sender: string
  content: string
  isUser: boolean
}

export function ChatInterfaceComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "AI", content: "Hello! How can I assist you today?", isUser: false },
    { id: 2, sender: "You", content: "Hi! I have a question about React hooks.", isUser: true },
    { id: 3, sender: "AI", content: "Sure, I'd be happy to help. What would you like to know about React hooks?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {

      const newMessage: Message = {
        id: messages.length + 1,
        sender: "You",
        content: inputMessage,
        isUser: true,
      }
      setMessages([...messages, newMessage])
      setInputMessage("")

      try{
        const response= await fetch('/send',{
          method : 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({inputMessage})
        })

        const {results }=await response.json()
        
        const aiMessage :Message={
          id:messages.length+2,
          sender :'AI',
          content: results ,
          isUser:false
          }
          setMessages ((prevmessages)=>[...prevmessages,aiMessage])
       
    
      } catch (error) {
        console.error("error sending message:",error)

    }

  }  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <div className="bg-primary p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-primary-foreground">Chat Interface</h2>
      </div>
      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.isUser ? "/user-avatar.png" : "/ai-avatar.png"} />
                <AvatarFallback>{message.isUser ? "You" : "AI"}</AvatarFallback>
              </Avatar>
              <div className={`rounded-lg p-3 ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {/* <p className="text-sm">{message.content}</p> */}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </Card>
  )
}