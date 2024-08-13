"use client";
import Confetti from "react-confetti";

const SuccessPage = () => {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
      <Confetti width={1500} height={670} />
      <h1 className="text-6xl text-green-700">Successful</h1>
      <h2 className="text-xl font-medium">
        We sent the invoice to your E-Mail
      </h2>
      <h3>You are being redirected to the order page</h3>
    </div>
  );
};

export default SuccessPage;
