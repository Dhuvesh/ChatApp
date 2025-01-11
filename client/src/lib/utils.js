export const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return "";
  }
};

