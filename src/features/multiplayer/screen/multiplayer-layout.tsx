/**
 * Multiplayer Layout
 *
 * Shared layout that wraps all multiplayer screens with providers
 * This ensures WebSocket connection and room state persist across navigation
 */

import { Outlet } from "react-router-dom";
import { WebSocketProvider } from "../providers/websocket-provider";
import { MultiplayerProvider } from "../providers/multiplayer-provider";
import { usernameService } from "@shared/services/username-service";
import { useUsernameGuard } from "@shared/hooks/use-username-guard";
import { UsernameModal } from "@shared/ui/components/username-modal";

export function MultiplayerLayout() {
  const username = usernameService.getUsername();
  const { showModal, checkAndPrompt, closeModal, saveUsername } =
    useUsernameGuard();

  if (!username) {

    return (
      <UsernameModal
        isOpen={!username}
        onSubmit={(username) => {
          saveUsername(username);
          window.location.reload();
        }}
        onClose={closeModal}
      />
    );
  }

  return (
    <WebSocketProvider>
      <MultiplayerProvider username={username}>
        <Outlet />
      </MultiplayerProvider>
    </WebSocketProvider>
  );
}
