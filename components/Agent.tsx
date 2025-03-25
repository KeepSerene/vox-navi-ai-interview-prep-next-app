"use client";

import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatuses {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  speaker: "user" | "system" | "assistant";
  content: string;
}

function Agent({ type, username, userId }: AgentProps) {
  const [isVapiAssistantTalking, setIsVapiAssistantTalking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatuses>(
    CallStatuses.INACTIVE
  );
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const latestMessage = messages[messages.length - 1].content;

  useEffect(() => {
    // Define Vapi event handlers/listeners
    const onCallStart = () => {
      setCallStatus(CallStatuses.ACTIVE);
    };
    const onCallEnd = () => {
      setCallStatus(CallStatuses.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          speaker: message.role,
          content: message.transcript,
        };

        setMessages((prevState) => [...prevState, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsVapiAssistantTalking(true);
    };
    const onSpeechEnd = () => {
      setIsVapiAssistantTalking(false);
    };

    const onError = (err: Error) => {
      console.error("Error:", err.message);
    };

    // Attach the event handlers/listeners to corresponding Vapi events
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);

    vapi.on("message", onMessage);

    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);

      vapi.off("message", onMessage);

      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);

      vapi.off("error", onError);
    };
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (callStatus === CallStatuses.FINISHED) {
      router.push("/");
      // Here, we're the not redirecting the user to the new interview page because:
      // It may take some time for the interview to be generated! Let the user find the interview
      // on the homepage once its generated!
    }
  }, [type, userId, callStatus, messages]);

  const handleConnectCall = async () => {
    setCallStatus(CallStatuses.CONNECTING);

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ASSISTANT_ID!, {
      variableValues: {
        username,
        userId,
      },
    });
  };

  const handleDisconnectCall = () => {
    setCallStatus(CallStatuses.FINISHED);
    vapi.stop();
  };

  const isCallStatusInactiveOrFinished =
    CallStatuses.INACTIVE || CallStatuses.FINISHED;

  return (
    <>
      <div className="call-view">
        {/* AI interviewer card */}
        <section className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="Vapi avatar"
              width={65}
              height={54}
              className="object-cover"
            />

            <>
              {isVapiAssistantTalking && <span className="animate-talking" />}
            </>
          </div>

          <h3 className="capitalize">AI interviewer</h3>
        </section>

        {/* User card */}
        <section className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt={username ? `${username}'s avatar` : "Your avatar"}
              width={540}
              height={540}
              className="size-[120px] rounded-full object-cover"
            />

            <h3>{username}</h3>
          </div>
        </section>
      </div>

      {/* Transcript's latest message */}
      <>
        {messages.length > 0 && (
          <div className="transcript-border mt-[1.5rem]">
            <div className="transcript">
              <p
                className={cn(
                  "opacity-0 transition-opacity duration-500",
                  "opacity-100 animate-fadeIn"
                )}
              >
                {latestMessage}
              </p>
            </div>
          </div>
        )}
      </>

      {/* Call controls */}
      <div className="w-full mt-[2.25rem] flex justify-center">
        {callStatus === CallStatuses.ACTIVE ? (
          <button
            type="button"
            onClick={handleDisconnectCall}
            className="btn-disconnect"
          >
            End
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnectCall}
            className="btn-call relative"
          >
            <span
              className={cn(
                "rounded-full opacity-75 absolute animate-ping",
                callStatus !== CallStatuses.CONNECTING ? "hidden" : ""
              )}
            />

            <span>{isCallStatusInactiveOrFinished ? "Call" : ". . ."}</span>
          </button>
        )}
      </div>
    </>
  );
}

export default Agent;
