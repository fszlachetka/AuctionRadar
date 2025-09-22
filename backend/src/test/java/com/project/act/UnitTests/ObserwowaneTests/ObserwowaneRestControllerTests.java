package com.project.act.UnitTests.ObserwowaneTests;

import com.project.act.Controllers.ObserwowaneRestController;
import com.project.act.DTOs.ObserwowaneDTO;
import com.project.act.Services.ObserwowaneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ObserwowaneRestControllerTests {

    @InjectMocks
    private ObserwowaneRestController obserwowaneRestController;

    @Mock
    private ObserwowaneService obserwowaneService;

    private ObserwowaneDTO obserwowaneDTO;

    @BeforeEach
    void setup() {
        obserwowaneDTO = new ObserwowaneDTO(1L, 100L);
    }

    @Test
    void testAddToFavorites() {
        // when
        ResponseEntity<String> response = obserwowaneRestController.addToFavorites(obserwowaneDTO);

        // then
        verify(obserwowaneService, times(1)).addToFavorites(obserwowaneDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Added to favorites", response.getBody());
    }

    @Test
    void testRemoveFromFavorites() {
        // when
        ResponseEntity<String> response = obserwowaneRestController.removeFromFavorites(obserwowaneDTO);

        // then
        verify(obserwowaneService, times(1)).removeFromFavorites(obserwowaneDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Removed from favorites", response.getBody());
    }

    @Test
    void testGetFavorites() {
        List<ObserwowaneDTO> favorites = List.of(obserwowaneDTO);
        when(obserwowaneService.getFavorites(1L)).thenReturn(favorites);

        ResponseEntity<List<ObserwowaneDTO>> response = obserwowaneRestController.getFavorites(1L);

        verify(obserwowaneService, times(1)).getFavorites(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(obserwowaneDTO.getUserId(), response.getBody().get(0).getUserId());
        assertEquals(obserwowaneDTO.getMieszkanieId(), response.getBody().get(0).getMieszkanieId());
    }
}