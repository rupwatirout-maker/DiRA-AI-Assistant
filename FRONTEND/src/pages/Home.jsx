import ChatBox from "../components/ChatBox";
import VoiceButton from "../components/VoiceButton";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="bg-black h-screen">
      <Navbar />
      <ChatBox />
      <VoiceButton />
    </div>
  );
}

export default Home;