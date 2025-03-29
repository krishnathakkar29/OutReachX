import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}

export default loading;
