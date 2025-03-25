import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatuses {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

function Agent({
  type,
  username,
  userId,
  interviewId,
  feedbackId,
  questions,
}: AgentProps) {
  const isTalking = true;

  const callStatus = CallStatuses.CONNECTING;

  const transcript = [
    "What's your name?",
    "My name is John Doe, nice to meet you!",
  ];

  const lastStatement = transcript[transcript.length - 1];

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

            <>{isTalking && <span className="animate-talking" />}</>
          </div>

          <h3 className="capitalize">AI interviewer</h3>
        </section>

        {/* User card */}
        <section className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt={`${username} avatar`}
              width={540}
              height={540}
              className="size-[120px] rounded-full object-cover"
            />

            <h3>{username}</h3>
          </div>
        </section>
      </div>

      {/* Transcript */}
      <>
        {transcript.length > 0 && (
          <div className="transcript-border mt-[1.5rem]">
            <div className="transcript">
              <p
                className={cn(
                  "opacity-0 transition-opacity duration-500",
                  "opacity-100 animate-fadeIn"
                )}
              >
                {lastStatement}
              </p>
            </div>
          </div>
        )}
      </>

      {/* Call controls */}
      <div className="w-full mt-[2.25rem] flex justify-center">
        {callStatus === CallStatuses.ACTIVE ? (
          <button type="button" className="btn-disconnect">
            End
          </button>
        ) : (
          <button type="button" className="btn-call relative">
            <span
              className={cn(
                "rounded-full opacity-75 absolute animate-ping",
                callStatus !== CallStatuses.CONNECTING ? "hidden" : ""
              )}
            />

            <span>
              {callStatus === CallStatuses.INACTIVE ||
              callStatus === CallStatuses.FINISHED
                ? "Call"
                : "..."}
            </span>
          </button>
        )}
      </div>
    </>
  );
}

export default Agent;
