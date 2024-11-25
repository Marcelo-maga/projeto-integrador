"use client"

import { Button } from "@nextui-org/react";
import { Printer } from "lucide-react";

export type ServiceOrderQuoteType  = {
    id: string,
    clientName: string,
    cpfCnpj: string,
    email: string,
    labor_value: number,
    material_value: number,
    whole_value: number,
}

type ServiceOrderQuoteComponentType = {
    ServiceOrderQuote: ServiceOrderQuoteType
}

export default function CreateServiceOrderQuote(serviceOrder: ServiceOrderQuoteComponentType) {

    const generateQuote = async () => {
        try {
            document.getElementById("printer-svg-"+serviceOrder.ServiceOrderQuote.id)!.style.display = "none"
            document.getElementById("loading-component-"+serviceOrder.ServiceOrderQuote.id)!.style.display = "inline-flex"
        
            const fileName = Date.now().toString(36) + Math.random().toString(36).substring(2) + ".pdf"
            await fetch("/api/quote", {
                method: 'POST',
                body: JSON.stringify({
                    fileName: fileName,
                    serviceOrder: serviceOrder.ServiceOrderQuote
                })
            }).then( r => r.json())

            document.getElementById("download-"+serviceOrder.ServiceOrderQuote.id)!.setAttribute("href","/"+fileName);
            await document.getElementById("download-"+serviceOrder.ServiceOrderQuote.id)?.click();

            await fetch("/api/quote", {
                method: 'DELETE',
                body: JSON.stringify({
                    fileName: fileName
                })
            }).then( r => r.json())

            document.getElementById("printer-svg-"+serviceOrder.ServiceOrderQuote.id)!.style.display = "block"
            document.getElementById("loading-component-"+serviceOrder.ServiceOrderQuote.id)!.style.display = "none"

        } catch (err) {
            console.log("ERROR: " + err)
        }   
    }

  return (
    <>      
    <Button 
        id="quote-printer"
        onPress={generateQuote} 
        style={{
            background: "none",
            border: "none",
            padding: "0",
            cursor: "pointer",
            color: "#333"
        }}
        className="bg-transparent px-0 mx-0 w-10 min-w-0"
    >
        <div className="flex p-1 rounded-full bg-yellow-500 shadow-yellow-500 shadow-md cursor-pointer ">
            <Printer id={"printer-svg-"+serviceOrder.ServiceOrderQuote.id} className="w-7 h-7" stroke="white"/>
            <Button
                id={"loading-component-"+serviceOrder.ServiceOrderQuote.id} 
                style={{
                    background: "none",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                    color: "#333",
                    display: "none"
                }}
                className="w-7 h-7 bg-transparent px-0 mx-0 min-w-0 m-auto" 
                isLoading
            ></Button>
        </div>
        
        {/* <h1 id={"loading-component-"+serviceOrder.ServiceOrderQuote.id} style={{display: "none"}}>Loading...</h1> */}
    </Button>
        <a download id={"download-"+serviceOrder.ServiceOrderQuote.id} hidden>download</a>
    </> 
  );
}