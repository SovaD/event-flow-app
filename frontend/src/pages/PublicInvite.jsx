import React, { useEffect, createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvite, submitRsvp } from "../store/inviteSlice";

export default function PublicInvite() {
  const { eventId, guestId } = useParams();
  const dispatch = useDispatch();

  const { data, status, replied } = useSelector((state) => state.invite);
  const placeholderImg =
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop";

  useEffect(() => {
    if (eventId && guestId && status === "idle") {
      dispatch(fetchInvite({ eventId, guestId }));
    }
  }, [eventId, guestId, status, dispatch]);

  const handleRSVP = async (rsvpStatus) => {
    try {
      await dispatch(
        submitRsvp({ eventId, guestId, status: rsvpStatus }),
      ).unwrap();
    } catch (error) {
      alert("Ой, что-то пошло не так. Попробуйте еще раз.");
    }
  };

  if (status === "loading")
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "sans-serif",
        }}
      >
        Загрузка приглашения...
      </div>
    );
  if (!data && status !== "idle")
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "red",
          fontFamily: "sans-serif",
        }}
      >
        Приглашение не найдено или ссылка устарела.
      </div>
    );
  if (!data) return null; // Для первоначального состояния idle

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        background: "#fff",
        minHeight: "100vh",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Обложка */}
      <img
        src={data.event.photoUrl || placeholderImg}
        alt="Cover"
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      />

      <div style={{ padding: "25px", textAlign: "center" }}>
        <h3
          style={{ color: "#ff4b82", margin: "0 0 10px 0", fontSize: "18px" }}
        >
          Персональное приглашение
        </h3>
        <h1 style={{ margin: "0 0 20px 0", fontSize: "26px" }}>
          {data.event.title}
        </h1>

        <div
          style={{
            background: "#fcfcfc",
            border: "1px solid #eee",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
          <p style={{ margin: "0 0 10px", fontSize: "18px" }}>
            👋 Здравствуйте, <strong>{data.guest.name}</strong>!
          </p>
          <p style={{ margin: "0 0 10px", color: "#555" }}>
            Мы будем очень рады видеть вас на нашем мероприятии.
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "15px 0",
            }}
          />
          <p style={{ margin: "5px 0" }}>
            📅 <strong>Когда:</strong>{" "}
            {new Date(data.event.date).toLocaleString([], {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          {data.event.location && (
            <p style={{ margin: "5px 0" }}>
              📍 <strong>Где:</strong> {data.event.location}
            </p>
          )}
          {data.event.description && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                background: "#fff0f5",
                borderRadius: "8px",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
              }}
            >
              {data.event.description}
            </div>
          )}
        </div>

        {replied ? (
          <div
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "20px",
              borderRadius: "15px",
              fontWeight: "bold",
            }}
          >
            🎉 Спасибо! Ваш ответ записан. Ждем вас!
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "15px" }}>
              Сможете ли вы прийти?
            </p>
            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <button
                onClick={() => handleRSVP("Подтвержден")}
                style={{
                  border: "none",
                  cursor: "pointer",
                  background: "#ff4b82",
                  color: "white",
                  padding: "15px",
                  fontSize: "16px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  transition: "opacity 0.2s",
                }}
              >
                ✅ Да, я обязательно буду!
              </button>
              <button
                onClick={() => handleRSVP("Отклонен")}
                style={{
                  border: "none",
                  cursor: "pointer",
                  background: "#f0f0f0",
                  color: "#555",
                  padding: "15px",
                  fontSize: "16px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                }}
              >
                ❌ К сожалению, не смогу
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
          Текущий статус:{" "}
          <span style={{ fontWeight: "bold" }}>
            {data.currentStatus || "Ожидает"}
          </span>
        </div>
      </div>
    </div>
  );
}
