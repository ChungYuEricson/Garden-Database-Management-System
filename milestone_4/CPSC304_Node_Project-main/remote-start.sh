#!/bin/bash

# Set Oracle environment
if [ -d /cs/software/rpms/oracle_client-signed/instantclient_23_7/instantclient_23_7 ]; then
export ORACLE_HOME=/cs/software/rpms/oracle_client-signed/instantclient_23_7/instantclient_23_7
export LD_LIBRARY_PATH=$ORACLE_HOME
elif [ -d /cs/software/rpms/oracle_client-signed/instantclient_23_4 ]; then
export ORACLE_HOME=/cs/software/rpms/oracle_client-signed/instantclient_23_4
export LD_LIBRARY_PATH=$ORACLE_HOME
elif [ -d /cs/software/rpms/oracle_client-signed/instantclient_21_11 ]; then
export ORACLE_HOME=/cs/software/rpms/oracle_client-signed/instantclient_21_11
export LD_LIBRARY_PATH=$ORACLE_HOME
else
echo "Oracle not found..."
exit 1
fi


# Configure the shared Node library on the undergrad server.
export NODE_PATH=/cs/local/generic/lib/cs304/node_modules

# File path
ENV_SERVER_PATH="./.env"

# Check the database host name and port
sed -i "/^ORACLE_HOST=/c\ORACLE_HOST=dbhost.students.cs.ubc.ca" $ENV_SERVER_PATH
sed -i "/^ORACLE_PORT=/c\ORACLE_PORT=1522" $ENV_SERVER_PATH

# Define a range
START=50000
END=60000

# Loop through the range and check if the port is in use
for PORT in $(seq $START $END); do
    # Check if the port is in use
    if ! ss -tuln | grep :$PORT > /dev/null; then
        # Bind to the port using a temporary process
        nc -l -p $PORT &
        TEMP_PID=$!

        # Update the port number in the .env file
        sed -i "/^PORT=/c\PORT=$PORT" $ENV_SERVER_PATH
        echo "Updated $ENV_SERVER_PATH with PORT=$PORT."

        # Kill the temporary process
        kill $TEMP_PID

        # Replace the bash process with the Node process
        exec node server.js
        break
    fi
done

