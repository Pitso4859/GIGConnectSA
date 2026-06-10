package com.gigconnect.repository;

import com.gigconnect.entity.AiChat;
import com.gigconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AiChatRepository extends JpaRepository<AiChat, UUID> {
    List<AiChat> findByUserOrderByCreatedAtAsc(User user);

    @org.springframework.data.jpa.repository.Query(
        "SELECT c FROM AiChat c WHERE c.user = :user ORDER BY c.createdAt DESC LIMIT 20"
    )
    List<AiChat> findRecentByUser(@org.springframework.data.repository.query.Param("user") User user);
}
