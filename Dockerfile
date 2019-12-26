FROM cirrusci/android-sdk:29

ARG flutter_version

ENV FLUTTER_HOME=${HOME}/sdks/flutter \
    FLUTTER_ROOT=$FLUTTER_HOME \
    FLUTTER_VERSION=$flutter_version

ENV PATH ${PATH}:${FLUTTER_HOME}/bin:${FLUTTER_HOME}/bin/cache/dart-sdk/bin

RUN git clone --branch ${FLUTTER_VERSION} https://github.com/flutter/flutter.git ${FLUTTER_HOME}

RUN flutter doctor

RUN echo -e "y\ny\n" | flutter doctor --android-licenses

RUN sudo apt-get update
RUN sudo apt-get install nodejs
RUN sudo apt-get install npm