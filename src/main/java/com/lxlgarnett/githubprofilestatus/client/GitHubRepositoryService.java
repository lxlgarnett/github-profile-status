/*
 * Created by Xiaolei Li on 8/1/23, 9:09 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 8/1/23, 9:09 PM
 */

package com.lxlgarnett.githubprofilestatus.client;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.Map;

/**
 * Service class for GitHub Repository API.
 *
 * @author xiaolei
 */
@Path("/repos")
@RegisterRestClient
public interface GitHubRepositoryService {

    /**
     * Get GitHub repository's language information's API.
     *
     * @param userName       GitHub user name
     * @param repositoryName Target repository's name
     * @return The response of GitHub API
     */
    @GET
    @Path("/{userName}/{repositoryName}/languages")
    @Produces(MediaType.APPLICATION_JSON)
    Uni<Map<String, Long>> getRepositoryLanguageInfo(@PathParam("userName") String userName,
                                                     @PathParam("repositoryName") String repositoryName);
}
