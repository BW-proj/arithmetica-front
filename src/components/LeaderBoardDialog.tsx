import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

interface Player {
  login: string;
  elo: number;
  isInGame: boolean;
}

interface LeaderBoard {
  players: Player[];
}

interface LeaderboardDialogProps {
  open: boolean;
  onClose: () => void;
  leaderBoard?: LeaderBoard | null;
}

const LeaderboardDialog: React.FC<LeaderboardDialogProps> = ({
  open,
  onClose,
  leaderBoard,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>🏆 Classement des joueurs</DialogTitle>
    <DialogContent>
      {leaderBoard?.players?.length ? (
        <List>
          {leaderBoard.players.map((p, idx) => (
            <ListItem key={p.login} divider>
              <ListItemText
                primary={`${idx + 1}. ${p.login}`}
                secondary={`ELO: ${p.elo} ${
                  p.isInGame ? "🟢 En jeu" : "⚪️ Connecté"
                }`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Aucun joueur dans le classement.</Typography>
      )}
    </DialogContent>
  </Dialog>
);

export default LeaderboardDialog;
