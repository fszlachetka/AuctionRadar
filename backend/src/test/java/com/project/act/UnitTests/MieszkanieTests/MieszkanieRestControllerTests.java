package com.project.act.UnitTests.MieszkanieTests;

import com.project.act.Controllers.MieszkanieRestController;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Services.MieszkanieService;
import com.project.act.UnitTests.TestFactories.MieszkanieTestFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class MieszkanieRestControllerTests{
    @InjectMocks
    MieszkanieRestController mieszkanieRestController;

    @Mock
    MieszkanieService mieszkanieService;

    @Test
    void testCreateMieszkanie(){
        ResponseEntity<MieszkanieGetDTO> response = mieszkanieRestController.createMieszkanie(MieszkanieTestFactory.defaultMieszkanieCreateDTO());
        verify(mieszkanieService, times(1)).createMieszkanie(MieszkanieTestFactory.defaultMieszkanieCreateDTO());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testGetMieszkanie(){
        List<MieszkanieGetDTO> defaultList = new ArrayList<>();
        defaultList.add(MieszkanieTestFactory.defaultMieszkanieGetDTO());

        when(mieszkanieService.getAllMieszkanie()).thenReturn(defaultList);
        ResponseEntity<List<MieszkanieGetDTO>> response = mieszkanieRestController.getAllMieszkania();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<MieszkanieGetDTO> resList = response.getBody();

        assertEquals(1, resList.size());
        assertEquals("KR/456", resList.get(0).getNrKsiegiWieczystej());
    }

    @Test
    void testFilterMieszkanie(){
        when(mieszkanieService.filterAndGetMieszkania(MieszkanieTestFactory.defaultMieszkanieFilterDTO()))
                .thenReturn(Collections.singletonList(MieszkanieTestFactory.defaultMieszkanieGetDTO()));

        ResponseEntity<List<MieszkanieGetDTO>> response = mieszkanieRestController.filterAndGetMieszkania(
                MieszkanieTestFactory.defaultMieszkanieFilterDTO()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<MieszkanieGetDTO> list = response.getBody();

        assertEquals(1,list.size());
        assertEquals(157.23, list.get(0).getRozmiar());
    }

}