

const API_BASE_URL = "http://localhost:5001/api/expenses";

const handleApiResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

export const loadExpenses = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.category) {
      queryParams.append("category", filters.category);
    }
    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append("endDate", filters.endDate);
    }

    const url = queryParams.toString()
      ? `${API_BASE_URL}?${queryParams.toString()}`
      : API_BASE_URL;

    const response = await fetch(url);
    const result = await handleApiResponse(response);

    return result.data.map((expense) => ({
      id: expense._id,
      amount: expense.amount,
      date: expense.date.split("T")[0], 
      category: expense.category,
      note: expense.note,
      createdAt: expense.createdAt,
    }));
  } catch (error) {
    console.error("Error loading expenses:", error);
    try {
      const data = localStorage.getItem("expense-tracker-data");
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((expense) => ({
          ...expense,
          amount:
            typeof expense.amount === "string"
              ? parseFloat(expense.amount)
              : expense.amount,
          date: expense.date || new Date().toISOString().split("T")[0],
          category: expense.category || "Other",
          note: expense.note || "",
          createdAt: expense.createdAt || new Date().toISOString(),
        }));
      }
    } catch (fallbackError) {
      console.error("Fallback localStorage also failed:", fallbackError);
    }
    return [];
  }
};



export const addExpense = async (expense) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    const result = await handleApiResponse(response);

    return {
      id: result.data._id,
      amount: result.data.amount,
      date: result.data.date.split("T")[0],
      category: result.data.category,
      note: result.data.note,
      createdAt: result.data.createdAt,
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const updateExpense = async (id, expense) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    const result = await handleApiResponse(response);

    return {
      id: result.data._id,
      amount: result.data.amount,
      date: result.data.date.split("T")[0],
      category: result.data.category,
      note: result.data.note,
      createdAt: result.data.createdAt,
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    await handleApiResponse(response);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

export const exportExpenses = async (expenses) => {
  try {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error("Error exporting expenses:", error);
    return { success: false, error: error.message };
  }
};

export const importExpenses = async () => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
              // Import each expense to the database
              const importedExpenses = [];
              for (const expense of data) {
                try {
                  const result = await addExpense({
                    amount: expense.amount,
                    date: expense.date,
                    category: expense.category,
                    note: expense.note,
                  });
                  importedExpenses.push(result);
                } catch (error) {
                  console.error("Error importing expense:", error);
                }
              }
              resolve({ success: true, expenses: importedExpenses });
            } else {
              resolve({ success: false, error: "Invalid file format" });
            }
          } catch (error) {
            resolve({ success: false, error: "Error parsing file" });
          }
        };
        reader.onerror = () =>
          resolve({ success: false, error: "Error reading file" });
        reader.readAsText(file);
      } else {
        resolve({ success: false, canceled: true });
      }
    };
    input.click();
  });
};

export const clearAllExpenses = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
    });

    await handleApiResponse(response);
    return { success: true };
  } catch (error) {
    console.error("Error clearing expenses:", error);
    return { success: false, error: error.message };
  }
};

export const getExpenseStats = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append("endDate", filters.endDate);
    }

    const url = queryParams.toString()
      ? `${API_BASE_URL}/stats?${queryParams.toString()}`
      : `${API_BASE_URL}/stats`;

    const response = await fetch(url);
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    console.error("Error fetching expense stats:", error);
    throw error;
  }
};
