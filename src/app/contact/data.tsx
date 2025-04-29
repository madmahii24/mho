export interface PolicyData {
  title: string;
  content: JSX.Element;
}

export const policies: { [key: string]: PolicyData } = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div>
        <p>
          Our privacy policy explains how we collect, use, and safeguard your
          personal information. We are committed to protecting your data and
          respecting your privacy.
        </p>
        <p>
          We collect data to enhance your experience and to provide personalized
          services. All collected data is securely stored and handled.
        </p>
        <ul className="list-disc ml-5">
          <li>Data Collection Methods</li>
          <li>Usage of Personal Data</li>
          <li>Third-Party Sharing Policies</li>
          <li>Security Measures</li>
        </ul>
      </div>
    )
  },
  refund: {
    title: "Refund & Cancellation Policy",
    content: (
      <div>
        <p>
          If you&apos;re not completely satisfied with your purchase, our refund and
          cancellation policy has got you covered. We aim to process refunds
          swiftly and transparently.
        </p>
        <p>
          Most refunds are processed within 30 days, subject to the terms and
          conditions stated below.
        </p>
        <ul className="list-disc ml-5">
          <li>Refund Eligibility</li>
          <li>Cancellation Process</li>
          <li>Processing Times</li>
          <li>Contact Information for Support</li>
        </ul>
      </div>
    )
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    content: (
      <div>
        <p>
          We offer reliable shipping options to ensure that your orders reach
          you on time. Our shipping and delivery policy outlines the estimated
          timelines and any applicable fees.
        </p>
        <p>
          Please review the following details to understand the shipping process
          for domestic and international orders.
        </p>
        <ul className="list-disc ml-5">
          <li>Domestic Shipping Timelines</li>
          <li>International Shipping Options</li>
          <li>Tracking and Order Status</li>
          <li>Handling and Processing Fees</li>
        </ul>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div>
        <p>
          Our Terms of Service outline the rules and guidelines for using our
          website and services. It is important that you read and understand
          these terms to ensure a safe and fair experience.
        </p>
        <p>
          The terms cover user responsibilities, limitations, and dispute
          resolution processes.
        </p>
        <ul className="list-disc ml-5">
          <li>User Responsibilities</li>
          <li>Account Management</li>
          <li>Service Limitations</li>
          <li>Dispute Resolution</li>
        </ul>
      </div>
    )
  }
};
