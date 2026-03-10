import ChatBox from '../components/ChatBox';

function ChatPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChatBox room="general" />
      <ChatBox room="private_admin" />
    </div>
  );
}

export default ChatPage;
