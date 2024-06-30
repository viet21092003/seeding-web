import React, { useMemo, useRef } from "react";
import { useMeeting, Constants, usePubSub } from "@videosdk.live/react-sdk";
import Controls from "./Controls";
import ParticipantView from "./ParticipantView";
import Chat from "./Chat";

const SpeakerView: React.FC = () => {
  const { participants, hlsState } = useMeeting();

  const speakers = useMemo(() => {
    const speakerParticipants = Array.from(participants.values()).filter(
      (participant) => {
        return participant.mode === Constants.modes.CONFERENCE;
      }
    );

    return speakerParticipants;
  }, [participants]);

  return (
    <div>
      <p className="mb-2">Trạng thái hiện tại của phiên live: {hlsState}</p>
      <Controls />
      {speakers.map((participant) => (
        <ParticipantView participantId={participant.id} key={participant.id} />
      ))}

      <Chat />
    </div>
  );
};

export default SpeakerView;
