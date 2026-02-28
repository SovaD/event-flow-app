import { useState, useEffect } from "react";
import axios from "axios";

// Функция для красивых цветов категорий
const getCategoryStyle = (category) => {
  const styles = {
    Свадьба: { bg: "#ffe4e6", color: "#e11d48" }, // Розовый
    "День рождения": { bg: "#e0f2fe", color: "#0284c7" }, // Голубой
    Корпоратив: { bg: "#f3e8ff", color: "#9333ea" }, // Фиолетовый
    Вечеринка: { bg: "#ffedd5", color: "#ea580c" }, // Оранжевый
    Другое: { bg: "#f1f5f9", color: "#475569" }, // Серый
  };
  return styles[category] || styles["Другое"];
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Все");
  const placeholderImg =
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop";

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    photoUrl: "",
    guests: [],
    category: "Другое",
  });
  const [showQuickAddContact, setShowQuickAddContact] = useState(false);
  const [newQuickContact, setNewQuickContact] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Гость",
  });

  useEffect(() => {
    fetchEvents();
    fetchContacts();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
      if (selectedEvent) {
        const updatedSelected = res.data.find(
          (e) => e._id === selectedEvent._id,
        );
        if (updatedSelected) setSelectedEvent(updatedSelected);
      }
    } catch (err) {
      console.error("Ошибка загрузки событий");
    }
  };

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Ошибка загрузки контактов");
    }
  };

  const startEditEvent = (event, e) => {
    e.stopPropagation();

    const formattedDate = new Date(event.date).toISOString().slice(0, 16);

    setNewEvent({
      title: event.title,
      category: event.category || "Другое",
      date: formattedDate,
      location: event.location || "",
      description: event.description || "",
      photoUrl: event.photoUrl || "",
      guests: event.guests
        .map((g) => (g.guest ? g.guest._id : null))
        .filter(Boolean),
    });

    setEditingEventId(event._id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddOrEditEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingEventId) {
        await axios.put(
          `http://localhost:5000/api/events/${editingEventId}`,
          newEvent,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post("http://localhost:5000/api/events/add", newEvent, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setNewEvent({
        title: "",
        date: "",
        location: "",
        description: "",
        photoUrl: "",
        guests: [],
        category: "Другое",
      });
      setIsFormOpen(false);
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      alert("Ошибка сохранения события");
    }
  };

  const handleUpdateStatus = async (eventId, guestId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/events/${eventId}/guest/${guestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchEvents();
    } catch (err) {
      alert("Ошибка обновления статуса");
    }
  };

  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Удалить мероприятие?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEvents();
    if (selectedEvent && selectedEvent._id === id) setSelectedEvent(null);
  };

  const handleQuickAddContact = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/contacts/add",
        newQuickContact,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewQuickContact({ name: "", email: "", phone: "", category: "Гость" });
      setShowQuickAddContact(false);
      await fetchContacts();
      setNewEvent((prev) => ({
        ...prev,
        guests: [...prev.guests, res.data._id],
      }));
    } catch (err) {
      alert("Ошибка быстрого добавления гостя");
    }
  };

  const sendInvite = (guest, event, type) => {
    try {
      if (!guest) throw new Error("Гость не найден");

      const baseUrl = window.location.origin.includes("http")
        ? window.location.origin
        : `http://${window.location.origin}`;
      const inviteLink = `${baseUrl}/invite/${event._id}/${guest._id}`;

      const message = `Здравствуйте, ${guest.name}!\n\nПриглашаем вас на мероприятие "${event.title}", которое состоится ${new Date(event.date).toLocaleDateString()}.\n\nПодтвердите присутствие по ссылке ниже:\n\n${inviteLink}\n\nБудем рады вас видеть!`;

      if (type === "whatsapp") {
        if (!guest.phone)
          throw new Error(`У гостя "${guest.name}" не указан номер телефона!`);

        const phone = guest.phone.replace(/\D/g, "");
        if (phone.length < 10)
          throw new Error(`Слишком короткий номер телефона у "${guest.name}".`);

        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
          "_blank",
        );
      } else if (type === "email") {
        if (!guest.email)
          throw new Error(`У гостя "${guest.name}" не указан email!`);

        const mailOpened = window.open(
          `mailto:${guest.email}?subject=${encodeURIComponent("Приглашение: " + event.title)}&body=${encodeURIComponent(message)}`,
          "_blank",
        );

        if (!mailOpened) {
          throw new Error(
            "Браузер заблокировал открытие окна почты. Разрешите всплывающие окна.",
          );
        }
      }
    } catch (error) {
      alert(`⚠️ Ошибка отправки: ${error.message}`);
      console.error(error);
    }
  };

  const sendBulkEmail = (event) => {
    try {
      const validGuests = event.guests.filter(
        (item) => item.guest && item.guest.email,
      );

      if (validGuests.length === 0) {
        throw new Error(
          "Ни у одного гостя в этом мероприятии не указан Email!",
        );
      }

      if (
        !window.confirm(
          `Будет сформировано ${validGuests.length} писем в вашем почтовом клиенте. Продолжить?`,
        )
      )
        return;

      let failedCount = 0;

      validGuests.forEach((item) => {
        const baseUrl = window.location.origin.includes("http")
          ? window.location.origin
          : `http://${window.location.origin}`;
        const inviteLink = `${baseUrl}/invite/${event._id}/${item.guest._id}`;
        const message = `👋 Здравствуйте, ${item.guest.name}!\n\nПриглашаем вас на мероприятие "${event.title}".\n\nПодтвердите присутствие по ссылке ниже:\n\n${inviteLink}\n\nЖдем вашего ответа!`;

        const mailOpened = window.open(
          `mailto:${item.guest.email}?subject=${encodeURIComponent("Приглашение: " + event.title)}&body=${encodeURIComponent(message)}`,
          "_blank",
        );
        if (!mailOpened) failedCount++;
      });

      if (failedCount > 0) {
        alert(
          `⚠️ Не удалось открыть ${failedCount} писем. Возможно, браузер заблокировал массовое открытие вкладок.`,
        );
      }
    } catch (error) {
      alert(`⚠️ Ошибка массовой рассылки: ${error.message}`);
      console.error(error);
    }
  };

  const filteredEvents = events
    .filter((ev) => ev.title.toLowerCase().includes(search.toLowerCase()))
    .filter((ev) => filterCategory === "Все" || ev.category === filterCategory)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="Все">Все категории</option>
          <option value="Свадьба">Свадьба</option>
          <option value="Корпоратив">Корпоратив</option>
          <option value="День рождения">День рождения</option>
          <option value="Другое">Другое</option>
        </select>

        <button
          onClick={fetchEvents}
          style={{
            background: "#e0f7fa",
            color: "#006064",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Обновить
        </button>

        <button
          className="btn btn-primary"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (editingEventId) {
              setEditingEventId(null);
              setNewEvent({
                title: "",
                date: "",
                location: "",
                description: "",
                photoUrl: "",
                guests: [],
                category: "Другое",
              });
            }
          }}
        >
          {isFormOpen ? "✖ Закрыть форму" : "➕ Создать"}
        </button>
      </div>

      {isFormOpen && (
        <div
          className="card"
          style={{ border: "2px solid #ff4b82", marginBottom: "30px" }}
        >
          <h3 style={{ marginTop: 0, color: "#ff4b82" }}>
            {editingEventId
              ? "✏️ Редактирование события"
              : "✨ Конструктор события"}
          </h3>
          <form onSubmit={handleAddOrEditEvent}>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <input
                type="text"
                placeholder="Название *"
                required
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                style={{
                  flex: "1 1 200px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <select
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, category: e.target.value })
                }
                style={{
                  flex: "1 1 150px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Свадьба">Свадьба</option>
                <option value="Корпоратив">Корпоратив</option>
                <option value="День рождения">День рождения</option>
                <option value="Другое">Другое</option>
              </select>
              <input
                type="datetime-local"
                required
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                style={{
                  flex: "1 1 200px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              <input
                type="text"
                placeholder="Локация (Адрес для 2ГИС)"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                style={{
                  flex: "1 1 250px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="text"
                placeholder="Ссылка на обложку (URL)"
                value={newEvent.photoUrl}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, photoUrl: e.target.value })
                }
                style={{
                  flex: "1 1 250px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <textarea
              placeholder="Описание (тайминг, важные детали...)"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "15px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 300px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    👥 Список гостей:
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowQuickAddContact(!showQuickAddContact)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      background: "transparent",
                      border: "1px solid #ff4b82",
                      color: "#ff4b82",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {showQuickAddContact ? "Отмена" : "+ Добавить гостя"}
                  </button>
                </div>

                {showQuickAddContact && (
                  <div
                    style={{
                      background: "#fff0f5",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      display: "flex",
                      gap: "5px",
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Имя *"
                      value={newQuickContact.name}
                      onChange={(e) =>
                        setNewQuickContact({
                          ...newQuickContact,
                          name: e.target.value,
                        })
                      }
                      style={{
                        flex: "1 1 120px",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Телефон"
                      value={newQuickContact.phone}
                      onChange={(e) =>
                        setNewQuickContact({
                          ...newQuickContact,
                          phone: e.target.value,
                        })
                      }
                      style={{
                        flex: "1 1 120px",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddContact}
                      className="btn btn-primary"
                      style={{ padding: "8px 15px", borderRadius: "6px" }}
                    >
                      Ок
                    </button>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    padding: "12px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    background: "#fcfcfc",
                  }}
                >
                  {contacts.map((c) => (
                    <label
                      key={c._id}
                      style={{
                        fontSize: "13px",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        border: "1px solid #ddd",
                        background: newEvent.guests.includes(c._id)
                          ? "#ff4b82"
                          : "#fff",
                        color: newEvent.guests.includes(c._id)
                          ? "#fff"
                          : "#444",
                      }}
                    >
                      <input
                        type="checkbox"
                        hidden
                        onChange={() =>
                          setNewEvent((p) => ({
                            ...p,
                            guests: p.guests.includes(c._id)
                              ? p.guests.filter((g) => g !== c._id)
                              : [...p.guests, c._id],
                          }))
                        }
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: "15px 30px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  alignSelf: "flex-end",
                }}
              >
                {editingEventId
                  ? "Сохранить изменения"
                  : "Опубликовать событие"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="contacts-grid">
        {filteredEvents.map((event) => {
          const confirmed = event.guests.filter(
            (g) => g.status === "Подтвержден",
          ).length;
          const catStyle = getCategoryStyle(event.category);

          return (
            <div
              key={event._id}
              className="card event-card"
              onClick={() => setSelectedEvent(event)}
              style={{
                padding: 0,
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                backgroundColor: "#fff",
                transition: "transform 0.2s",
                border: "none",
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "180px" }}
              >
                <img
                  src={event.photoUrl || placeholderImg}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    margin: 0,
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: catStyle.bg,
                    color: catStyle.color,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {event.category || "Другое"}
                </span>

                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={(e) => startEditEvent(event, e)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      fontSize: "14px",
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDeleteEvent(event._id, e)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      color: "#ff4d4f",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: "20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    color: "#2D3142",
                  }}
                >
                  {event.title}
                </h3>

                <div
                  style={{
                    color: "#ff4b82",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "14px",
                  }}
                >
                  📅 {new Date(event.date).toLocaleDateString("ru-RU")}
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    backgroundColor: "#f8f9fa",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      color: "#555",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    👥 Всего: {event.guests?.length || 0}
                  </span>
                  <span
                    style={{
                      color: "#10b981",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    ✅ Идут: {confirmed}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "15px",
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedEvent.photoUrl || placeholderImg}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />

            <h2 style={{ color: "#ff4b82", margin: "0 0 10px 0" }}>
              {selectedEvent.title}
            </h2>
            <p>
              📅{" "}
              <strong>
                {new Date(selectedEvent.date).toLocaleString("ru-RU")}
              </strong>
            </p>
            {selectedEvent.location && <p>📍 {selectedEvent.location}</p>}

            <div
              style={{
                borderTop: "2px solid #eee",
                paddingTop: "15px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h4 style={{ margin: 0 }}>Список гостей и рассылка:</h4>
              <button
                onClick={() => sendBulkEmail(selectedEvent)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                📧 Отправить всем (Email)
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              {selectedEvent.guests.map((item) => {
                if (!item.guest) return null;
                return (
                  <div
                    key={item.guest._id}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      background:
                        item.status === "Подтвержден"
                          ? "#f1f8e9"
                          : item.status === "Отклонен"
                            ? "#ffebee"
                            : "#fff",
                    }}
                  >
                    <div style={{ flex: "1 1 150px" }}>
                      <div style={{ fontWeight: "bold" }}>
                        {item.guest.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {item.guest.phone && (
                          <span style={{ marginRight: "5px" }}>
                            📞 {item.guest.phone}
                          </span>
                        )}
                        {item.guest.email && <span>📧 {item.guest.email}</span>}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginTop: "5px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() =>
                            sendInvite(item.guest, selectedEvent, "whatsapp")
                          }
                          style={{
                            border: "none",
                            background: "#25D366",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          WA
                        </button>
                        <button
                          onClick={() =>
                            sendInvite(item.guest, selectedEvent, "email")
                          }
                          style={{
                            border: "none",
                            background: "#007bff",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Email
                        </button>
                      </div>

                      <div
                        style={{
                          borderLeft: "1px solid #ddd",
                          paddingLeft: "15px",
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <button
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            background:
                              item.status === "Подтвержден"
                                ? "#c8e6c9"
                                : "#fff",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedEvent._id,
                              item.guest._id,
                              "Подтвержден",
                            )
                          }
                          title="Подтвержден"
                        >
                          ✅
                        </button>
                        <button
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            background:
                              item.status === "Ожидает" ? "#ffe0b2" : "#fff",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedEvent._id,
                              item.guest._id,
                              "Ожидает",
                            )
                          }
                          title="Ожидает"
                        >
                          ⏳
                        </button>
                        <button
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            background:
                              item.status === "Отклонен" ? "#ffcdd2" : "#fff",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedEvent._id,
                              item.guest._id,
                              "Отклонен",
                            )
                          }
                          title="Отклонен"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "20px", padding: "12px" }}
              onClick={() => setSelectedEvent(null)}
            >
              Закрыть окно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
