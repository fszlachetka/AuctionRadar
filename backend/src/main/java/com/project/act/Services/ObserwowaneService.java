package com.project.act.Services;

import com.project.act.DTOs.ObserwowaneDTO;
import com.project.act.Entities.Mieszkanie;
import com.project.act.Entities.Obserwowane;
import com.project.act.Entities.ObserwowaneId;
import com.project.act.Entities.User;
import com.project.act.Repositories.MieszkanieRepository;
import com.project.act.Repositories.ObserwowaneRepository;
import com.project.act.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ObserwowaneService {

    private final ObserwowaneRepository obserwowaneRepository;
    private final UserRepository userRepository;
    private final MieszkanieRepository mieszkanieRepository;

    public ObserwowaneService(ObserwowaneRepository obserwowaneRepository, UserRepository userRepository, MieszkanieRepository mieszkanieRepository) {
        this.obserwowaneRepository = obserwowaneRepository;
        this.userRepository = userRepository;
        this.mieszkanieRepository = mieszkanieRepository;
    }

    public void addToFavorites(ObserwowaneDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Mieszkanie mieszkanie = mieszkanieRepository.findById(dto.getMieszkanieId())
                .orElseThrow(() -> new RuntimeException("Mieszkanie not found"));

        Obserwowane obserwowane = new Obserwowane();
        obserwowane.setId(new ObserwowaneId(dto.getUserId(), dto.getMieszkanieId()));
        if (obserwowaneRepository.existsById(obserwowane.getId())) {
            throw new RuntimeException("Already in favorites");
        }
        obserwowane.setUser(user);
        obserwowane.setMieszkanie(mieszkanie);

        obserwowaneRepository.save(obserwowane);
    }

    public void removeFromFavorites(ObserwowaneDTO dto) {
        ObserwowaneId id = new ObserwowaneId(dto.getUserId(), dto.getMieszkanieId());
        if (!obserwowaneRepository.existsById(id)) {
            throw new RuntimeException("Favorite not found");
        }
        obserwowaneRepository.deleteById(id);
    }

    public List<ObserwowaneDTO> getFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getObserwowane().stream()
                .map(obserwowane -> new ObserwowaneDTO(
                        obserwowane.getUser().getUserId(),
                        obserwowane.getMieszkanie().getMieszkanieId()
                ))
                .collect(Collectors.toList());
    }
}