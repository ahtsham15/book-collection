export default function PageLayout({ children, centered = false }) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${
          centered ? "flex items-center justify-center" : ""
        }`}
      >
        {children}
      </div>
    );
  }
  