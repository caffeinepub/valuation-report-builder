import React from "react";

export function Letterhead() {
  return (
    <div className="border-2 border-gray-800 p-3 mb-4">
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          DINESH KUMAR JANGIR
        </div>
        <div className="text-sm font-medium text-gray-700 mt-0.5">
          Surveyor &amp; Loss Assessor of Motors, Misc. &amp; Engineering
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-700">
        <div className="space-y-0.5">
          <div>Licence no. SLA/121529</div>
          <div>Valid upto 26th Jan. 2029</div>
        </div>
        <div className="text-right space-y-0.5">
          <div>3-B-19/1, Tilak Nagar,</div>
          <div className="font-medium">BHILWARA - 311 001</div>
          <div>Mobile No. 094132 24766</div>
          <div>e-mail - dk24766@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
