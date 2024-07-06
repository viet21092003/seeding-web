package matcha.banking.be.dao;

import matcha.banking.be.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserDao extends CrudRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);
}
