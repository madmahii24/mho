import { CheckCircle, Copy, Download } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { downloadRecipt } from "@/utils/SecureDataService";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number | string;
  transactionId: string;
  orderId: string;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  amount,
  transactionId,
  orderId
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };
  const handleDownloadRecipt = async () => {
    downloadRecipt(orderId).then((response) => {
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `receipt-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 max-w-md w-full text-center relative animate-fadeIn">
        {/* Success icon with better animation */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
            <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400 animate-pulse" />
          </div>
        </div>

        {/* Main content */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Thank you for your payment. Your transaction has been completed.
        </p>

        {/* Payment details card */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mt-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200">
              Payment Details
            </h2>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full">
              Completed
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 mb-3">
            <span className="text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
            &#8377;{amount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Transaction ID
            </span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate max-w-40">
                {transactionId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(transactionId)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDownloadRecipt}
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Receipt
          </button>
          <button
            onClick={onClose}
            type="button"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
