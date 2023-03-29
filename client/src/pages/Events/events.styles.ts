import { SxProps } from "@mui/material";

const useStyles = () => {
  return {
    tableHeaderIconContainer: {
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: 1,
    } as SxProps,
  };
};

export default useStyles;
