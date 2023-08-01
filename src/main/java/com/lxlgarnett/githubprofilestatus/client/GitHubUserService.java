/*
 * Created by Xiaolei Li on 8/1/23, 9:09 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 8/1/23, 9:09 PM
 */

package com.lxlgarnett.githubprofilestatus.client;

import com.lxlgarnett.githubprofilestatus.model.github.repository.Repository;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

/**
 * Service class for GitHub User API.
 *
 * @author xiaolei
 */
@Path("/users")
@RegisterRestClient
public interface GitHubUserService {

    /**
     * Get GitHub user's repository information's API.
     *
     * @param userName GitHub user name
     * @return The response of GitHub API
     */
    @GET
    @Path("/{userName}/repos")
    @Produces(MediaType.APPLICATION_JSON)
    Uni<List<Repository>> getGitHubUserRepositoryInfo(@PathParam("userName") String userName);
}
