/*
 * Created by Xiaolei Li on 8/1/23, 9:09 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 8/1/23, 9:09 PM
 */

package com.lxlgarnett.githubprofilestatus.service;

import com.lxlgarnett.githubprofilestatus.client.GitHubRepositoryService;
import com.lxlgarnett.githubprofilestatus.client.GitHubUserService;
import com.lxlgarnett.githubprofilestatus.model.github.repository.Repository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Service class for top language.
 *
 * @author xiaolei
 */
@ApplicationScoped
public class TopLanguageService {

    private static final String GITHUB_REPOSITORY_LANGUAGE_API_URL_REGULAR_EXPRESSION = "^https://api\\.github\\.com/repos/([^/]+)/([^/]+)/languages$";

    @Inject
    @RestClient
    GitHubUserService gitHubUserService;

    @Inject
    @RestClient
    GitHubRepositoryService gitHubRepositoryService;

    /**
     * Get top languages for the given user.
     *
     * @param userName GitHub user name
     */
    public void getTopLanguage(@NotBlank(message = "userName is required") String userName) {
        Log.trace("getTopLanguage --> Start");
        List<Repository> notForkedRepositoryList = gitHubUserService.getGitHubUserRepositoryInfo(userName)
                .await()
                .indefinitely()
                .stream()
                .filter(repository -> !repository.isFork())
                .toList();

        Map<String, Long> languageInfomap = new HashMap<>();
        Pattern pattern = Pattern.compile(GITHUB_REPOSITORY_LANGUAGE_API_URL_REGULAR_EXPRESSION);
        notForkedRepositoryList.forEach(repository -> {
            Matcher matcher = pattern.matcher(repository.getLanguagesUrl());
            if (matcher.matches()) {
                String githubUserName = matcher.group(1);
                String repositoryName = matcher.group(2);

                Map<String, Long> repositoryLanguangeMap = gitHubRepositoryService.getRepositoryLanguageInfo(githubUserName, repositoryName)
                        .await()
                        .indefinitely();

                repositoryLanguangeMap.forEach((key, value) -> {
                    if (languageInfomap.containsKey(key)) {
                        languageInfomap.replace(key, languageInfomap.get(key) + value);
                    } else {
                        languageInfomap.put(key, value);
                    }
                });
            }
        });
        Log.debug("Language Info is: " + languageInfomap);
    }
}
